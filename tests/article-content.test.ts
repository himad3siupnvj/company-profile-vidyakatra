import { describe, expect, it } from "vitest"
import {
  createFallbackArticleDocument,
  getArticlePlainText,
  getArticleReadTime,
  hasArticleTextContent,
  normalizeArticleDocument,
  slugify,
  toTitleCase,
  type ArticleDocument,
} from "@/lib/article-content"

describe("article content utilities", () => {
  it("slugifies titles for public URLs", () => {
    expect(slugify("Workshop UI/UX Design Bersama Praktisi Industri!")).toBe(
      "workshop-ui-ux-design-bersama-praktisi-industri",
    )
    expect(slugify("  FUNGAMES Vol. 1 HIMA D3SI 2026  ")).toBe("fungames-vol-1-hima-d3si-2026")
  })

  it("normalizes unknown content into a document", () => {
    expect(normalizeArticleDocument(null, "fallback")).toEqual(createFallbackArticleDocument("fallback"))
  })

  it("keeps valid article documents unchanged", () => {
    const document: ArticleDocument = {
      type: "doc",
      content: [{ id: "a", type: "paragraph", text: "Halo dunia" }],
    }

    expect(normalizeArticleDocument(document)).toBe(document)
  })

  it("calculates read time from text and image metadata", () => {
    const document: ArticleDocument = {
      type: "doc",
      content: [
        { id: "p", type: "paragraph", text: "satu dua tiga empat" },
        { id: "i", type: "image", url: "/image.jpg", alt: "Dokumentasi kegiatan", caption: "Peserta berkumpul" },
      ],
    }

    expect(getArticlePlainText(document)).toBe("satu dua tiga empat Dokumentasi kegiatan Peserta berkumpul")
    expect(getArticleReadTime(document, 4)).toBe("2 min")
  })

  it("detects whether a document has publishable content", () => {
    expect(hasArticleTextContent(createFallbackArticleDocument("   "))).toBe(false)
    expect(hasArticleTextContent(createFallbackArticleDocument("Isi artikel"))).toBe(true)
  })

  it("formats slugs into labels", () => {
    expect(toTitleCase("media-dan-komunikasi")).toBe("Media Dan Komunikasi")
  })
})
