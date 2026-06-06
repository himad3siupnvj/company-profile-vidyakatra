import { describe, expect, it } from "vitest"
import { generateArticleDraftFromText } from "@/lib/article-generator"

describe("article source generator", () => {
  it("removes PDF page markers and keeps generated drafts in schema-safe bounds", () => {
    const draft = generateArticleDraftFromText(`
      FUNGAMES Vol. 1 HIMA D3SI FIK UPNVJ; Wadah Kebersamaan Dan Olahraga Mahasiswa Jakarta, 17 April 2026 - Fakultas Ilmu Komputer Universitas Pembangunan Nasional Veteran Jakarta menyelenggarakan kegiatan fun games untuk mahasiswa.

      -- 1 of 2 --

      Kegiatan ini diselenggarakan sebagai wadah bagi mahasiswa D3 Sistem Informasi untuk mempererat hubungan antar mahasiswa melalui kegiatan olahraga.

      -- 2 of 2 --
    `)

    expect(draft.title).toBe("FUNGAMES Vol. 1 HIMA D3SI FIK UPNVJ; Wadah Kebersamaan Dan Olahraga Mahasiswa")
    expect(draft.title.length).toBeLessThanOrEqual(180)
    expect(draft.slugBase.length).toBeLessThanOrEqual(180)
    expect(draft.content.content.map((block) => (block.type === "image" ? block.caption : block.text))).not.toContain(
      "-- 1 of 2 --",
    )
  })

  it("detects Indonesian datelines and structures berita acara labels", () => {
    const draft = generateArticleDraftFromText(`
      RAPAT KOORDINASI KABINET VIDYAKATRA Jakarta, 5 Juni 2026 - HIMA D3 Sistem Informasi melaksanakan rapat koordinasi bulanan.

      Halaman 1 dari 2

      Tujuan Kegiatan: Menyelaraskan agenda kerja dan kebutuhan publikasi setiap departemen.

      2/2
    `)

    expect(draft.title).toBe("RAPAT KOORDINASI KABINET VIDYAKATRA")
    expect(draft.content.content[0]).toMatchObject({
      type: "paragraph",
      text: "Jakarta, 5 Juni 2026 - HIMA D3 Sistem Informasi melaksanakan rapat koordinasi bulanan.",
    })
    expect(draft.content.content[1]).toMatchObject({
      type: "heading",
      level: 2,
      text: "Tujuan Kegiatan",
    })
    expect(draft.content.content.map((block) => (block.type === "image" ? block.caption : block.text))).not.toContain(
      "Halaman 1 dari 2",
    )
  })

  it("falls back to a usable title and empty document for blank sources", () => {
    const draft = generateArticleDraftFromText(" ")

    expect(draft.title).toBe("Draft Berita Acara")
    expect(draft.slugBase).toBe("draft-berita-acara")
    expect(draft.content).toEqual({
      type: "doc",
      content: [{ id: "fallback-paragraph", type: "paragraph", text: "" }],
    })
  })
})
