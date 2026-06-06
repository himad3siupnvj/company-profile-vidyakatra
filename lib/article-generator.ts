import { createFallbackArticleDocument, slugify, type ArticleDocument } from "@/lib/article-content"

const MAX_TITLE_LENGTH = 180
const MAX_SLUG_BASE_LENGTH = 180
const DATELINE_CITIES = [
  "Jakarta",
  "Bogor",
  "Depok",
  "Tangerang",
  "Bekasi",
  "Bandung",
  "Yogyakarta",
  "Surabaya",
  "Semarang",
  "Malang",
  "Solo",
  "Surakarta",
  "Denpasar",
  "Medan",
  "Makassar",
]
const DATELINE_PATTERN = new RegExp(
  `\\s+(${DATELINE_CITIES.join("|")}),\\s+\\d{1,2}\\s+[A-Za-zÀ-ž]+\\s+\\d{4}\\s*[-–—,].*$`,
)

function normalizeWhitespace(text: string) {
  return text
    .replace(/\r/g, "\n")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

function isPageMarker(value: string) {
  const text = value.trim()

  return (
    /^--\s*\d+\s+of\s+\d+\s*--$/i.test(text) ||
    /^page\s+\d+(\s+of\s+\d+)?$/i.test(text) ||
    /^halaman\s+\d+(\s+dari\s+\d+)?$/i.test(text) ||
    /^\d+\s*\/\s*\d+$/.test(text) ||
    /^[-–—]?\s*\d+\s*[-–—]?$/.test(text)
  )
}

function joinBrokenPdfLines(text: string) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => !isPageMarker(line))
    .join("\n")
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.replace(/\n+/g, " ").replace(/\s+/g, " ").trim())
    .filter((paragraph) => paragraph && !isPageMarker(paragraph))
}

function looksLikeDateline(paragraph: string) {
  return new RegExp(`^(${DATELINE_CITIES.join("|")}),\\s+\\d{1,2}\\s+[A-Za-zÀ-ž]+\\s+\\d{4}\\s*[-–—,]`).test(paragraph)
}

function truncateAtWord(value: string, maxLength: number) {
  if (value.length <= maxLength) return value

  const truncated = value.slice(0, maxLength).trim()
  const lastSpace = truncated.lastIndexOf(" ")

  return (lastSpace > 80 ? truncated.slice(0, lastSpace) : truncated).replace(/[;:,.]$/, "")
}

function cleanTitleCandidate(value: string) {
  const beforeDate = value.replace(DATELINE_PATTERN, "")

  return beforeDate
    .replace(/\s+/g, " ")
    .trim()
}

function makeTitle(paragraphs: string[]) {
  if (!paragraphs.length) return "Draft Berita Acara"

  const source = paragraphs.find((paragraph) => !looksLikeDateline(paragraph)) ?? paragraphs[0] ?? "Draft Berita Acara"
  const title = cleanTitleCandidate(source) || "Draft Berita Acara"

  return truncateAtWord(title, MAX_TITLE_LENGTH)
}

function makeExcerpt(paragraphs: string[]) {
  const source = paragraphs.find(looksLikeDateline) ?? paragraphs[1] ?? paragraphs[0] ?? ""

  return source.length > 220 ? `${source.slice(0, 217).trim()}...` : source
}

function removeGeneratedTitle(paragraph: string, title: string) {
  if (!paragraph.startsWith(title)) return paragraph

  return paragraph.slice(title.length).replace(/^[\s;:,.\-–—]+/, "").trim()
}

function splitStructuredParagraph(paragraph: string) {
  const match = paragraph.match(/^([A-ZÀ-ž][A-Za-zÀ-ž\s/()&-]{2,48}):\s+(.+)$/)

  if (!match) return [paragraph]

  return [match[1].trim(), match[2].trim()]
}

function blockFromParagraph(paragraph: string, index: number): ArticleDocument["content"][number] {
  const isSectionTitle =
    /^[A-ZÀ-ž][A-Za-zÀ-ž\s/()&-]{2,48}$/.test(paragraph) &&
    !looksLikeDateline(paragraph) &&
    paragraph.split(/\s+/).length <= 7

  if (isSectionTitle) {
    return {
      id: `generated-${index + 1}`,
      type: "heading",
      level: 2,
      text: paragraph,
    }
  }

  return {
    id: `generated-${index + 1}`,
    type: "paragraph",
    text: paragraph,
  }
}

export function generateArticleDraftFromText(rawText: string) {
  const paragraphs = joinBrokenPdfLines(normalizeWhitespace(rawText))
  const title = makeTitle(paragraphs)
  const body = paragraphs
    .map((paragraph) => removeGeneratedTitle(paragraph, title))
    .flatMap(splitStructuredParagraph)
    .filter(Boolean)
  const content: ArticleDocument = {
    type: "doc",
    content: body.length
      ? body.map(blockFromParagraph)
      : createFallbackArticleDocument("").content,
  }

  return {
    title,
    slugBase: slugify(title).slice(0, MAX_SLUG_BASE_LENGTH).replace(/-$/, ""),
    excerpt: makeExcerpt(paragraphs),
    content,
    category: "berita",
    author: "Tim Media",
  }
}
