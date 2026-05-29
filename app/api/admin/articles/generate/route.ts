import path from "node:path"
import { pathToFileURL } from "node:url"
import { eq } from "drizzle-orm"
import { PDFParse } from "pdf-parse"
import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/db"
import { articleCategories, articles } from "@/db/schema"
import { requireApiPermission } from "@/lib/api-guard"
import { getArticleReadTime, slugify, toTitleCase } from "@/lib/article-content"
import { generateArticleDraftFromText } from "@/lib/article-generator"
import { validateUploadFile } from "@/lib/storage"

export const runtime = "nodejs"

let isPdfWorkerConfigured = false

function configurePdfWorker() {
  if (isPdfWorkerConfigured) return

  const workerPath = path.join(process.cwd(), "node_modules", "pdfjs-dist", "legacy", "build", "pdf.worker.mjs")
  PDFParse.setWorker(pathToFileURL(workerPath).href)
  isPdfWorkerConfigured = true
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
      return NextResponse.json({ error: "PDF file is required" }, { status: 400 })
    }

    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")

    if (!isPdf) {
      return NextResponse.json({ error: "Generator sementara hanya mendukung PDF." }, { status: 400 })
    }

    const validation = validateUploadFile(new File([file], file.name, { type: "application/pdf" }), "article-source")

    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    configurePdfWorker()

    const parser = new PDFParse({ data: buffer })
    const parsed = await parser.getText()
    await parser.destroy()
    const draft = generateArticleDraftFromText(parsed.text)

    if (!draft.title || !draft.content.content.length) {
      return NextResponse.json({ error: "PDF tidak punya teks yang bisa diekstrak." }, { status: 400 })
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

    return NextResponse.json({
      article: {
        id: created.id,
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
    const message = error instanceof Error ? error.message : "Generate PDF gagal."

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
