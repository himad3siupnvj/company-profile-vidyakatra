import { and, desc, eq, isNull } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/db"
import { articleCategories, articles, auditLogs, users } from "@/db/schema"
import { requireApiPermission } from "@/lib/api-guard"
import {
  getArticleReadTime,
  hasArticleTextContent,
  normalizeArticleDocument,
  slugify,
  toTitleCase,
} from "@/lib/article-content"
import {
  articleWorkflowPermissions,
  canTransitionArticle,
  getNextArticleStatus,
  isArticleWorkflowAction,
  type ArticleStatus,
} from "@/lib/article-workflow"
import { revalidatePublicArticles } from "@/lib/public-cache"

export const runtime = "nodejs"

function serializeArticle(row: {
  id: string
  slug: string
  title: string
  excerpt: string | null
  content: unknown
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
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? "",
    content: normalizeArticleDocument(row.content, row.excerpt ?? ""),
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
      slug: articles.slug,
      title: articles.title,
      excerpt: articles.excerpt,
      content: articles.content,
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
  const content = normalizeArticleDocument(payload.content, String(payload.content ?? payload.excerpt ?? ""))
  const db = getDb()
  const [existingArticle] = await db
    .select()
    .from(articles)
    .where(and(eq(articles.title, title), isNull(articles.deletedAt)))
    .limit(1)

  if (existingArticle && existingArticle.status !== "draft") {
    return NextResponse.json({ error: "Article with this title already exists" }, { status: 409 })
  }

  if (existingArticle) {
    const [updated] = await db
      .update(articles)
      .set({
        excerpt: String(payload.excerpt ?? ""),
        content,
        categoryId,
        authorName: String(payload.author ?? "Tim Media"),
        thumbnailUrl: payload.thumbnailUrl || payload.image || null,
        thumbnailAlt: payload.thumbnailAlt || title,
        readTime: payload.readTime || getArticleReadTime(content),
        isFeatured: Boolean(payload.featured),
        updatedAt: now,
      })
      .where(eq(articles.id, existingArticle.id))
      .returning()
    const [category] = await db.select().from(articleCategories).where(eq(articleCategories.id, categoryId)).limit(1)

    revalidatePublicArticles()

    return NextResponse.json({
      article: serializeArticle({
        ...updated,
        categoryName: category?.name ?? null,
        categorySlug: category?.slug ?? null,
        authorName: null,
        displayAuthorName: updated.authorName,
      }),
    })
  }

  const [created] = await db
    .insert(articles)
    .values({
      title,
      slug: `${slugify(title)}-${Date.now()}`,
      excerpt: String(payload.excerpt ?? ""),
      content,
      categoryId,
      status: "draft",
      authorName: String(payload.author ?? "Tim Media"),
      thumbnailUrl: payload.thumbnailUrl || payload.image || null,
      thumbnailAlt: payload.thumbnailAlt || title,
      readTime: payload.readTime || getArticleReadTime(content),
      isFeatured: Boolean(payload.featured),
      publishedAt: null,
      createdAt: now,
      updatedAt: now,
    })
    .returning()

  const [category] = await db.select().from(articleCategories).where(eq(articleCategories.id, categoryId)).limit(1)

  revalidatePublicArticles()

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

export async function PUT(request: NextRequest) {
  const guard = await requireApiPermission("article.edit_all")
  if (guard.response) return guard.response

  const payload = await request.json()
  const id = String(payload.id ?? request.nextUrl.searchParams.get("id") ?? "")
  const title = String(payload.title ?? "").trim()

  if (!id || !title) {
    return NextResponse.json({ error: "Valid id and title are required" }, { status: 400 })
  }

  const db = getDb()
  const [existing] = await db.select().from(articles).where(eq(articles.id, id)).limit(1)

  if (!existing || existing.deletedAt) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 })
  }

  if (existing.status !== "draft" && existing.status !== "rejected") {
    return NextResponse.json({ error: "Only draft or rejected articles can be edited" }, { status: 409 })
  }

  const categoryId = await resolveCategoryId(payload.category)
  const content = normalizeArticleDocument(payload.content, String(payload.excerpt ?? ""))
  const now = new Date()

  const [updated] = await db
    .update(articles)
    .set({
      title,
      slug: existing.slug,
      excerpt: String(payload.excerpt ?? ""),
      content,
      categoryId,
      authorName: String(payload.author ?? existing.authorName ?? "Tim Media"),
      thumbnailUrl: payload.thumbnailUrl || payload.image || null,
      thumbnailAlt: payload.thumbnailAlt || title,
      readTime: payload.readTime || getArticleReadTime(content),
      isFeatured: Boolean(payload.featured),
      rejectedNote: null,
      updatedAt: now,
    })
    .where(eq(articles.id, id))
    .returning()

  await db.insert(auditLogs).values({
    actorId: guard.user?.id ?? null,
    action: "article.update",
    entityType: "article",
    entityId: id,
    metadata: {
      status: existing.status,
    },
    createdAt: now,
  })

  const [category] = await db.select().from(articleCategories).where(eq(articleCategories.id, categoryId)).limit(1)

  revalidatePublicArticles()

  return NextResponse.json({
    article: serializeArticle({
      ...updated,
      categoryName: category?.name ?? null,
      categorySlug: category?.slug ?? null,
      authorName: null,
      displayAuthorName: updated.authorName,
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
  revalidatePublicArticles()

  return NextResponse.json({ ok: true })
}

export async function PATCH(request: NextRequest) {
  const payload = await request.json()
  const id = String(payload.id ?? request.nextUrl.searchParams.get("id") ?? "")
  const action = payload.action

  if (!id || !isArticleWorkflowAction(action)) {
    return NextResponse.json({ error: "Valid id and workflow action are required" }, { status: 400 })
  }

  const guard = await requireApiPermission(articleWorkflowPermissions[action])
  if (guard.response) return guard.response

  const db = getDb()
  const [article] = await db
    .select()
    .from(articles)
    .where(eq(articles.id, id))
    .limit(1)

  if (!article || article.deletedAt) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 })
  }

  if (!canTransitionArticle(article.status, action)) {
    return NextResponse.json(
      { error: `Cannot ${action} article from ${article.status} status` },
      { status: 409 },
    )
  }

  if (action === "submit" && (!article.title.trim() || !hasArticleTextContent(article.content))) {
    return NextResponse.json({ error: "Article needs a title and content before submit" }, { status: 400 })
  }

  if (action === "approve" && (!article.title.trim() || !hasArticleTextContent(article.content))) {
    return NextResponse.json({ error: "Article needs a title and content before approval" }, { status: 400 })
  }

  const now = new Date()
  const nextStatus = getNextArticleStatus(action)
  const rejectedNote = action === "reject" ? String(payload.rejectedNote ?? "").trim() : null

  if (action === "reject" && !rejectedNote) {
    return NextResponse.json({ error: "Rejected note is required" }, { status: 400 })
  }

  const [updated] = await db
    .update(articles)
    .set({
      status: nextStatus,
      reviewerId: action === "approve" || action === "reject" ? guard.user?.id ?? null : article.reviewerId,
      rejectedNote: action === "reject" ? rejectedNote : null,
      publishedAt: action === "approve" ? now : action === "restore" ? null : article.publishedAt,
      updatedAt: now,
    })
    .where(eq(articles.id, id))
    .returning()

  const [category] = updated.categoryId
    ? await db.select().from(articleCategories).where(eq(articleCategories.id, updated.categoryId)).limit(1)
    : [null]

  const [author] = updated.authorId
    ? await db.select({ name: users.name }).from(users).where(eq(users.id, updated.authorId)).limit(1)
    : [null]

  revalidatePublicArticles()

  return NextResponse.json({
    article: serializeArticle({
      ...updated,
      categoryName: category?.name ?? null,
      categorySlug: category?.slug ?? null,
      authorName: author?.name ?? null,
      displayAuthorName: updated.authorName,
    }),
  })
}
