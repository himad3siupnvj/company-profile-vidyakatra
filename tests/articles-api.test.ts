import { NextRequest, NextResponse } from "next/server"
import { beforeEach, describe, expect, it, vi } from "vitest"

const mocks = vi.hoisted(() => ({
  getDb: vi.fn(),
  requireApiPermission: vi.fn(),
}))

vi.mock("@/db", () => ({
  getDb: mocks.getDb,
}))

vi.mock("@/lib/api-guard", () => ({
  requireApiPermission: mocks.requireApiPermission,
}))

import { DELETE, PATCH, POST, PUT } from "@/app/api/admin/articles/route"

function jsonRequest(method: string, body: unknown, url = "http://localhost/api/admin/articles") {
  return new NextRequest(url, {
    method,
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" },
  })
}

describe("articles API", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.requireApiPermission.mockResolvedValue({
      user: { id: "user-1", role: "administrator" },
      response: null,
    })
  })

  it("rejects article creation without permission", async () => {
    mocks.requireApiPermission.mockResolvedValue({
      user: null,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    })

    const response = await POST(jsonRequest("POST", { title: "Draft" }))

    expect(response.status).toBe(403)
    expect(mocks.getDb).not.toHaveBeenCalled()
  })

  it("validates create payload before touching the database", async () => {
    const response = await POST(jsonRequest("POST", { title: "   " }))

    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({ error: "Title is required" })
    expect(mocks.getDb).not.toHaveBeenCalled()
  })

  it("validates update payload before touching the database", async () => {
    const response = await PUT(jsonRequest("PUT", { id: "article-1", title: "   " }))

    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({ error: "Valid id and title are required" })
    expect(mocks.getDb).not.toHaveBeenCalled()
  })

  it("prevents contributors from editing another author's draft", async () => {
    mocks.requireApiPermission.mockResolvedValue({
      user: { id: "user-1", role: "staff" },
      response: null,
    })
    const limit = vi.fn().mockResolvedValue([
      {
        id: "article-1",
        authorId: "user-2",
        status: "draft",
        deletedAt: null,
      },
    ])
    const select = vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => ({ limit })),
      })),
    }))
    const update = vi.fn()
    mocks.getDb.mockReturnValue({ select, update })

    const response = await PUT(
      jsonRequest("PUT", {
        id: "article-1",
        title: "Draft milik orang lain",
      }),
    )

    expect(response.status).toBe(403)
    expect(update).not.toHaveBeenCalled()
  })

  it("soft deletes articles through update, not hard delete", async () => {
    const where = vi.fn().mockResolvedValue(undefined)
    const set = vi.fn((payload: Record<string, unknown>) => ({ where }))
    const update = vi.fn(() => ({ set }))
    mocks.getDb.mockReturnValue({ update })

    const response = await DELETE(new NextRequest("http://localhost/api/admin/articles?id=article-1", { method: "DELETE" }))

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ ok: true })
    expect(update).toHaveBeenCalledTimes(1)
    expect(set.mock.calls[0][0]).toMatchObject({ deletedAt: expect.any(Date), updatedAt: expect.any(Date) })
  })

  it("updates workflow status without inserting a new article", async () => {
    const now = new Date("2026-05-29T10:00:00.000Z")
    const article = {
      id: "article-1",
      title: "Draft Berita",
      slug: "draft-berita",
      excerpt: "Ringkasan",
      content: { type: "doc", content: [{ id: "p1", type: "paragraph", text: "Isi berita" }] },
      categoryId: null,
      status: "submitted",
      authorId: null,
      authorName: "Tim Media",
      reviewerId: null,
      thumbnailUrl: null,
      thumbnailAlt: null,
      readTime: "1 min",
      isFeatured: false,
      views: 0,
      publishedAt: null,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    }
    const updated = { ...article, status: "published", reviewerId: "user-1", publishedAt: now }
    const limit = vi.fn().mockResolvedValue([article])
    const select = vi.fn(() => ({ from: vi.fn(() => ({ where: vi.fn(() => ({ limit })) })) }))
    const returning = vi.fn().mockResolvedValue([updated])
    const where = vi.fn(() => ({ returning }))
    const set = vi.fn((payload: Record<string, unknown>) => ({ where }))
    const update = vi.fn(() => ({ set }))
    const values = vi.fn().mockResolvedValue(undefined)
    const insert = vi.fn(() => ({ values }))
    const execute = vi.fn().mockResolvedValue(undefined)
    const transaction = vi.fn(async (callback) => callback({ update, insert, execute }))
    mocks.getDb.mockReturnValue({ select, transaction })

    const response = await PATCH(jsonRequest("PATCH", { id: "article-1", action: "approve" }))
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.article.status).toBe("published")
    expect(update).toHaveBeenCalledTimes(1)
    expect(set.mock.calls[0][0]).toMatchObject({ status: "published", reviewerId: "user-1" })
    expect(insert).toHaveBeenCalledTimes(1)
    expect(execute).toHaveBeenCalledTimes(2)
    expect(values.mock.calls[0][0]).toMatchObject({
      action: "article.approve",
      entityId: "article-1",
      metadata: {
        previousStatus: "submitted",
        newStatus: "published",
      },
    })
  })

  it("returns a conflict when another request already changed the article status", async () => {
    const article = {
      id: "article-1",
      title: "Draft Berita",
      content: { type: "doc", content: [{ id: "p1", type: "paragraph", text: "Isi berita" }] },
      status: "submitted",
      authorId: "user-2",
      deletedAt: null,
    }
    const limit = vi.fn().mockResolvedValue([article])
    const select = vi.fn(() => ({ from: vi.fn(() => ({ where: vi.fn(() => ({ limit })) })) }))
    const returning = vi.fn().mockResolvedValue([])
    const update = vi.fn(() => ({
      set: vi.fn(() => ({
        where: vi.fn(() => ({ returning })),
      })),
    }))
    const insert = vi.fn()
    const execute = vi.fn()
    const transaction = vi.fn(async (callback) => callback({ update, insert, execute }))
    mocks.getDb.mockReturnValue({ select, transaction })

    const response = await PATCH(jsonRequest("PATCH", { id: "article-1", action: "approve" }))

    expect(response.status).toBe(409)
    expect(insert).not.toHaveBeenCalled()
    expect(execute).not.toHaveBeenCalled()
  })
})
