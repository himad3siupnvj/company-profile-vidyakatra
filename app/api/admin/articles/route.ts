import { desc, eq, isNull } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/db"
import { articleCategories, articles, users } from "@/db/schema"
import { requireApiPermission } from "@/lib/api-guard"

export const runtime = "nodejs"

type ArticleStatus = "draft" | "submitted" | "approved" | "rejected" | "published" | "archived"

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function toTitleCase(value: string) {
  return value
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

function createFallbackDocument(text: string) {
  return {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: text ? [{ type: "text", text }] : [],
      },
    ],
  }
}

function serializeArticle(row: {
  id: string
  title: string
  excerpt: string | null
  categoryName: string | null
  categorySlug: string | null
  status: ArticleStatus
  authorName: string | null
  displayAuthorName: string | null
  publishedAt: Date | null
  createdAt: Date
  thumbnailUrl: string | null
  thumbnailAlt: string | null
  readTime: string | null
  isFeatured: boolean
  views: number
}) {
  return {
    id: row.id,
    title: row.title,
    excerpt: row.excerpt ?? "",
    category: row.categorySlug ?? row.categoryName ?? "uncategorized",
    categoryLabel: row.categoryName ?? "Uncategorized",
    status: row.status,
    author: row.displayAuthorName ?? row.authorName ?? "Tim Media",
    publishedAt: row.publishedAt?.toISOString().slice(0, 10) ?? null,
    createdAt: row.createdAt.toISOString().slice(0, 10),
    thumbnail: row.thumbnailUrl ?? "/news/default.jpg",
    thumbnailAlt: row.thumbnailAlt ?? row.title,
    image: row.thumbnailUrl ?? "/news/default.jpg",
    readTime: row.readTime ?? "3 min",
    featured: row.isFeatured,
    views: row.views,
  }
}

async function resolveCategoryId(category: unknown) {
  const rawCategory = String(category ?? "berita").trim()
  const slug = slugify(rawCategory || "berita")
  const name = toTitleCase(rawCategory || "Berita")
  const db = getDb()
  const [existing] = await db
    .select()
    .from(articleCategories)
    .where(eq(articleCategories.slug, slug))
    .limit(1)

  if (existing) {
    return existing.id
  }

  const now = new Date()
  const [created] = await db
    .insert(articleCategories)
    .values({
      name,
      slug,
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: articleCategories.slug,
      set: { name, updatedAt: now },
    })
    .returning()

  return created.id
}

export async function GET() {
  const guard = await requireApiPermission("article.read_all")
  if (guard.response) return guard.response

  const db = getDb()
  const rows = await db
    .select({
      id: articles.id,
      title: articles.title,
      excerpt: articles.excerpt,
      categoryName: articleCategories.name,
      categorySlug: articleCategories.slug,
      status: articles.status,
      authorName: users.name,
      displayAuthorName: articles.authorName,
      publishedAt: articles.publishedAt,
      createdAt: articles.createdAt,
      thumbnailUrl: articles.thumbnailUrl,
      thumbnailAlt: articles.thumbnailAlt,
      readTime: articles.readTime,
      isFeatured: articles.isFeatured,
      views: articles.views,
    })
    .from(articles)
    .leftJoin(articleCategories, eq(articles.categoryId, articleCategories.id))
    .leftJoin(users, eq(articles.authorId, users.id))
    .where(isNull(articles.deletedAt))
    .orderBy(desc(articles.createdAt))

  return NextResponse.json({ articles: rows.map(serializeArticle) })
}

export async function POST(request: NextRequest) {
  const guard = await requireApiPermission("article.create")
  if (guard.response) return guard.response

  const payload = await request.json()
  const now = new Date()
  const title = String(payload.title ?? "").trim()

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 })
  }

  const categoryId = await resolveCategoryId(payload.category)
  const db = getDb()
  const [created] = await db
    .insert(articles)
    .values({
      title,
      slug: `${slugify(title)}-${Date.now()}`,
      excerpt: String(payload.excerpt ?? ""),
      content:
        payload.content && typeof payload.content === "object"
          ? payload.content
          : createFallbackDocument(String(payload.content ?? payload.excerpt ?? "")),
      categoryId,
      status: "draft",
      authorName: String(payload.author ?? "Tim Media"),
      thumbnailUrl: payload.thumbnailUrl || payload.image || null,
      thumbnailAlt: payload.thumbnailAlt || title,
      readTime: payload.readTime || "3 min",
      isFeatured: Boolean(payload.featured),
      publishedAt: null,
      createdAt: now,
      updatedAt: now,
    })
    .returning()

  const [category] = await db.select().from(articleCategories).where(eq(articleCategories.id, categoryId)).limit(1)

  return NextResponse.json({
    article: serializeArticle({
      ...created,
      categoryName: category?.name ?? null,
      categorySlug: category?.slug ?? null,
      authorName: null,
      displayAuthorName: created.authorName,
    }),
  })
}

export async function DELETE(request: NextRequest) {
  const guard = await requireApiPermission("article.delete")
  if (guard.response) return guard.response

  const id = request.nextUrl.searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "Valid id is required" }, { status: 400 })
  }

  const db = getDb()
  await db.update(articles).set({ deletedAt: new Date(), updatedAt: new Date() }).where(eq(articles.id, id))

  return NextResponse.json({ ok: true })
}
