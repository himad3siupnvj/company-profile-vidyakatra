import { count, eq } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/db"
import { articleCategories, articles, users } from "@/db/schema"
import { requireApiPermission } from "@/lib/api-guard"
import { hasArticleTextContent, normalizeArticleDocument } from "@/lib/article-content"
import {
  articleWorkflowPermissions,
  canTransitionArticle,
  getNextArticleStatus,
  isArticleWorkflowAction,
  type ArticleStatus,
} from "@/lib/article-workflow"

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

export async function PATCH(request: NextRequest) {
  const payload = await request.json()
  const id = String(payload.id ?? "")
  const action = payload.action

  if (!id || !isArticleWorkflowAction(action)) {
    return NextResponse.json({ error: "Valid article id and status action are required" }, { status: 400 })
  }

  const guard = await requireApiPermission(articleWorkflowPermissions[action])
  if (guard.response) return guard.response

  const db = getDb()
  const [article] = await db.select().from(articles).where(eq(articles.id, id)).limit(1)

  if (!article || article.deletedAt) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 })
  }

  if (!canTransitionArticle(article.status, action)) {
    return NextResponse.json({ error: `Cannot ${action} article from ${article.status} status` }, { status: 409 })
  }

  if ((action === "submit" || action === "approve") && (!article.title.trim() || !hasArticleTextContent(article.content))) {
    return NextResponse.json({ error: "Article needs a title and content before status update" }, { status: 400 })
  }

  const rejectedNote = action === "reject" ? String(payload.rejectedNote ?? "").trim() : null

  if (action === "reject" && !rejectedNote) {
    return NextResponse.json({ error: "Rejected note is required" }, { status: 400 })
  }

  const now = new Date()
  const nextStatus = getNextArticleStatus(action)
  const [{ value: beforeCount }] = await db.select({ value: count() }).from(articles)
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

  const [{ value: afterCount }] = await db.select({ value: count() }).from(articles)

  if (afterCount !== beforeCount) {
    return NextResponse.json({ error: "Status update must not create article rows" }, { status: 500 })
  }

  const [category] = updated.categoryId
    ? await db.select().from(articleCategories).where(eq(articleCategories.id, updated.categoryId)).limit(1)
    : [null]
  const [author] = updated.authorId
    ? await db.select({ name: users.name }).from(users).where(eq(users.id, updated.authorId)).limit(1)
    : [null]

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
