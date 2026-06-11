import { describe, expect, it } from "vitest"
import { toCsv } from "@/lib/csv"
import { createZip } from "@/lib/zip"

describe("export utilities", () => {
  it("escapes commas, quotes, newlines, nulls, and dates in CSV", () => {
    const csv = toCsv([
      {
        name: 'Divisi "Media", Kreatif',
        note: "baris satu\nbaris dua",
        empty: null,
        createdAt: new Date("2026-06-11T08:00:00.000Z"),
      },
    ])

    expect(csv).toBe(
      'name,note,empty,createdAt\r\n"Divisi ""Media"", Kreatif","baris satu\nbaris dua",,2026-06-11T08:00:00.000Z',
    )
  })

  it("creates a valid uncompressed ZIP container with named files", () => {
    const zip = createZip([
      { name: "members.csv", content: "id,name\r\n1,Ayu" },
      { name: "articles.csv", content: "id,title\r\n2,Berita" },
    ])

    expect(zip.readUInt32LE(0)).toBe(0x04034b50)
    expect(zip.readUInt32LE(zip.length - 22)).toBe(0x06054b50)
    expect(zip.includes(Buffer.from("members.csv"))).toBe(true)
    expect(zip.includes(Buffer.from("articles.csv"))).toBe(true)
  })
})
