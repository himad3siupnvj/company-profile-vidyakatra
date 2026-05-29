import { createFallbackArticleDocument, slugify, type ArticleDocument } from "@/lib/article-content"

const MAX_TITLE_LENGTH = 180
const MAX_SLUG_BASE_LENGTH = 180

function normalizeWhitespace(text: string) {
  return text
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

function joinBrokenPdfLines(text: string) {
  return text
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.replace(/\n+/g, " ").replace(/\s+/g, " ").trim())
    .filter((paragraph) => paragraph && !/^--\s*\d+\s+of\s+\d+\s*--$/i.test(paragraph))
}

function looksLikeDateline(paragraph: string) {
  return /^[A-Z][A-Za-z\s]+,\s+\d{1,2}\s+[A-Za-z]+\s+\d{4}\s+/.test(paragraph)
}

function truncateAtWord(value: string, maxLength: number) {
  if (value.length <= maxLength) return value

  const truncated = value.slice(0, maxLength).trim()
  const lastSpace = truncated.lastIndexOf(" ")

  return (lastSpace > 80 ? truncated.slice(0, lastSpace) : truncated).replace(/[;:,.]$/, "")
}

function cleanTitleCandidate(value: string) {
  const beforeDate = value.replace(/,\s+\d{1,2}\s+[A-Za-z]+\s+\d{4}\s+.*$/, "")

  return beforeDate
    .replace(/\s+[A-Z][A-Za-z]+$/, "")
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

  return paragraph.slice(title.length).replace(/^[\s;:,.]+/, "").trim()
}

export function generateArticleDraftFromText(rawText: string) {
  const paragraphs = joinBrokenPdfLines(normalizeWhitespace(rawText))
  const title = makeTitle(paragraphs)
  const body = paragraphs.map((paragraph) => removeGeneratedTitle(paragraph, title)).filter(Boolean)
  const content: ArticleDocument = {
    type: "doc",
    content: body.length
      ? body.map((paragraph, index) => ({
          id: `generated-${index + 1}`,
          type: "paragraph" as const,
          text: paragraph,
        }))
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
