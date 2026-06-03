import { describe, expect, it } from "vitest"
import { createStoragePath } from "@/lib/storage"

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
})
