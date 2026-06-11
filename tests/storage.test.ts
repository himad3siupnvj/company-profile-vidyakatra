import { describe, expect, it } from "vitest"
import { createStoragePath, validateUploadFile } from "@/lib/storage"

describe("storage utilities", () => {
  it("creates structured object paths from upload context", () => {
    const file = new File(["image"], "Cover Kegiatan HIMA.PNG", { type: "image/png" })

    const path = createStoragePath(file, "article-image", {
      year: 2026,
      section: "articles",
      category: "Berita Acara",
      kind: "Cover",
    })

    expect(path).toMatch(
      /^2026\/articles\/berita-acara\/cover\/[0-9a-f-]{36}-cover-kegiatan-hima\.png$/,
    )
  })

  it("falls back to safe article image folders", () => {
    const file = new File(["image"], "!!!.webp", { type: "image/webp" })
    const path = createStoragePath(file, "article-image", { year: 2026 })

    expect(path).toMatch(/^2026\/articles\/general\/image\/[0-9a-f-]{36}-upload\.webp$/)
  })

  it("supports context-aware article content folders", () => {
    const file = new File(["image"], "Dokumentasi 01.jpg", { type: "image/jpeg" })
    const path = createStoragePath(file, "article-image", {
      year: 2026,
      section: "articles",
      category: "kegiatan",
      kind: "content",
    })

    expect(path).toMatch(/^2026\/articles\/kegiatan\/content\/[0-9a-f-]{36}-dokumentasi-01\.jpg$/)
  })

  it("rejects files whose bytes do not match the claimed image type", async () => {
    const file = new File(["not really an image"], "fake.png", { type: "image/png" })

    await expect(validateUploadFile(file, "article-image")).resolves.toMatchObject({
      ok: false,
      error: "Isi file tidak sesuai dengan format yang dipilih.",
    })
  })

  it("accepts a PNG with a valid signature", async () => {
    const file = new File(
      [new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00])],
      "valid.png",
      { type: "image/png" },
    )

    await expect(validateUploadFile(file, "article-image")).resolves.toEqual({ ok: true })
  })
})
