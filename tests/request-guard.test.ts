import { NextRequest } from "next/server"
import { beforeEach, describe, expect, it, vi } from "vitest"

const mocks = vi.hoisted(() => ({
  execute: vi.fn(),
}))

vi.mock("@/db", () => ({
  getDb: () => ({ execute: mocks.execute }),
}))

import { enforceRateLimit, isSameOriginRequest } from "@/lib/request-guard"

describe("request guards", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns 429 after a shared rate-limit bucket exceeds its limit", async () => {
    mocks.execute
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([
        {
          count: 6,
          resetAt: new Date(Date.now() + 60_000),
        },
      ])
    const request = new NextRequest("https://cms.example.com/api/auth/claim", {
      headers: { "x-forwarded-for": "203.0.113.10" },
    })

    const response = await enforceRateLimit(request, "auth-claim:user@example.com", 5, 60_000)

    expect(response?.status).toBe(429)
    expect(response?.headers.get("Retry-After")).toBeTruthy()
  })

  it("allows requests that remain within the rate limit", async () => {
    mocks.execute.mockResolvedValueOnce([
      {
        count: 1,
        resetAt: new Date(Date.now() + 60_000),
      },
    ])
    const request = new NextRequest("https://cms.example.com/api/auth/login")

    await expect(enforceRateLimit(request, "auth-login:user@example.com", 10, 60_000)).resolves.toBeNull()
  })

  it("rejects a browser request from another origin", () => {
    const request = new NextRequest("https://cms.example.com/api/auth/login", {
      headers: {
        host: "cms.example.com",
        origin: "https://attacker.example",
      },
    })

    expect(isSameOriginRequest(request)).toBe(false)
  })
})
