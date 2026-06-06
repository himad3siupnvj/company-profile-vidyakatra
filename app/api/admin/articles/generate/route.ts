import path from "node:path"
import { pathToFileURL } from "node:url"
import { eq } from "drizzle-orm"
import mammoth from "mammoth"
import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/db"
import { articleCategories, articles } from "@/db/schema"
import { requireApiPermission } from "@/lib/api-guard"
import { getArticleReadTime, slugify, toTitleCase } from "@/lib/article-content"
import { generateArticleDraftFromText } from "@/lib/article-generator"
import { revalidatePublicArticles } from "@/lib/public-cache"
import { validateUploadFile } from "@/lib/storage"

export const runtime = "nodejs"

let isPdfWorkerConfigured = false

type SupportedSourceType = "pdf" | "docx"

function ensurePdfJsGlobals() {
  const globals = globalThis as typeof globalThis & {
    DOMMatrix?: typeof DOMMatrix
    ImageData?: typeof ImageData
    Path2D?: typeof Path2D
  }

  if (!globals.DOMMatrix) {
    class ServerDOMMatrix {
      constructor(_init?: string | number[]) {}

      invertSelf() {
        return this
      }

      multiplySelf(_other?: unknown) {
        return this
      }

      preMultiplySelf(_other?: unknown) {
        return this
      }

      translate(_x?: number, _y?: number) {
        return this
      }

      scale(_scaleX?: number, _scaleY?: number) {
        return this
      }
    }

    globals.DOMMatrix = ServerDOMMatrix as unknown as typeof DOMMatrix
  }

  if (!globals.ImageData) {
    globals.ImageData = class ServerImageData {
      readonly data: Uint8ClampedArray
      readonly width: number
      readonly height: number

      constructor(width: number, height: number) {
        this.width = width
        this.height = height
        this.data = new Uint8ClampedArray(width * height * 4)
      }
    } as unknown as typeof ImageData
  }

  if (!globals.Path2D) {
    globals.Path2D = class ServerPath2D {
      constructor(_path?: unknown) {}

      addPath(_path: unknown, _transform?: unknown) {}
    } as unknown as typeof Path2D
  }
}

async function loadPdfParser() {
  ensurePdfJsGlobals()
  const { PDFParse } = await import("pdf-parse")

  if (!isPdfWorkerConfigured) {
    const workerPath = path.join(process.cwd(), "node_modules", "pdfjs-dist", "legacy", "build", "pdf.worker.mjs")
    PDFParse.setWorker(pathToFileURL(workerPath).href)
    isPdfWorkerConfigured = true
  }

  return PDFParse
}

function getSupportedSourceType(file: File): SupportedSourceType | null {
  const name = file.name.toLowerCase()

  if (file.type === "application/pdf" || name.endsWith(".pdf")) return "pdf"

  if (
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    name.endsWith(".docx")
  ) {
    return "docx"
  }

  return null
}

async function extractTextFromSource(file: File) {
  const sourceType = getSupportedSourceType(file)

  if (!sourceType) {
    if (file.name.toLowerCase().endsWith(".doc") || file.type === "application/msword") {
      throw new Error("Generator belum mendukung file DOC lama. Simpan ulang sebagai DOCX atau PDF dulu.")
    }

    throw new Error("Generator hanya mendukung PDF atau DOCX.")
  }

  const buffer = Buffer.from(await file.arrayBuffer())

  if (sourceType === "docx") {
    const result = await mammoth.extractRawText({ buffer })

    return result.value
  }

  const PDFParse = await loadPdfParser()

  const parser = new PDFParse({ data: buffer })

  try {
    const parsed = await parser.getText()

    return parsed.text
  } finally {
    await parser.destroy()
  }
}

async function resolveCategoryId(category: string) {
  const slug = slugify(category || "berita")
  const name = toTitleCase(category || "Berita")
  const db = getDb()
  const [existing] = await db.select().from(articleCategories).where(eq(articleCategories.slug, slug)).limit(1)

  if (existing) return existing.id

  const now = new Date()
  const [created] = await db
    .insert(articleCategories)
    .values({ name, slug, createdAt: now, updatedAt: now })
    .onConflictDoUpdate({ target: articleCategories.slug, set: { name, updatedAt: now } })
    .returning()

  return created.id
}

export async function POST(request: NextRequest) {
  try {
    const guard = await requireApiPermission("article.create")
    if (guard.response) return guard.response

    const formData = await request.formData()
    const file = formData.get("file")

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Source berita acara wajib diupload." }, { status: 400 })
    }

    const supportedSourceType = getSupportedSourceType(file)

    if (!supportedSourceType) {
      const isLegacyDoc = file.type === "application/msword" || file.name.toLowerCase().endsWith(".doc")
      const message = isLegacyDoc
        ? "Generator belum mendukung file DOC lama. Simpan ulang sebagai DOCX atau PDF dulu."
        : "Generator hanya mendukung PDF atau DOCX."

      return NextResponse.json({ error: message }, { status: 400 })
    }

    const validation = validateUploadFile(file, "article-source")

    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const sourceText = await extractTextFromSource(file)
    const draft = generateArticleDraftFromText(sourceText)

    if (!draft.title || !draft.content.content.length) {
      return NextResponse.json({ error: "Source tidak punya teks yang bisa diekstrak." }, { status: 400 })
    }

    const storagePath: string | null = null
    const sourceUrl: string | null = null
    const now = new Date()
    const db = getDb()
    const categoryId = await resolveCategoryId(draft.category)
    const [created] = await db
      .insert(articles)
      .values({
        title: draft.title,
        slug: `${draft.slugBase}-${Date.now()}`,
        excerpt: draft.excerpt,
        content: draft.content,
        categoryId,
        status: "draft",
        authorName: draft.author,
        readTime: getArticleReadTime(draft.content),
        thumbnailUrl: null,
        thumbnailAlt: null,
        isFeatured: false,
        publishedAt: null,
        createdAt: now,
        updatedAt: now,
      })
      .returning()

    revalidatePublicArticles()

    return NextResponse.json({
      article: {
        id: created.id,
        slug: created.slug,
        title: created.title,
        excerpt: created.excerpt ?? "",
        content: draft.content,
        category: draft.category,
        categoryLabel: "Berita",
        status: created.status,
        author: created.authorName ?? "Tim Media",
        publishedAt: null,
        createdAt: created.createdAt.toISOString().slice(0, 10),
        thumbnail: "/news/default.jpg",
        thumbnailAlt: created.title,
        image: "/news/default.jpg",
        readTime: created.readTime ?? getArticleReadTime(draft.content),
        featured: false,
        views: 0,
        sourceUrl,
        sourcePath: storagePath,
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Generate draft gagal."

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
