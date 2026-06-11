import { desc, eq } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/db"
import { articles, articleVersions, users } from "@/db/schema"
import { requireApiPermission } from "@/lib/api-guard"
import { can } from "@/lib/auth"

export const runtime = "nodejs"

export async function GET(request: NextRequest) {
  const guard = await requireApiPermission("article.edit_own")
  if (guard.response) return guard.response

  const articleId = request.nextUrl.searchParams.get("articleId")

  if (!articleId) {
    return NextResponse.json({ error: "Valid articleId is required" }, { status: 400 })
  }

  const db = getDb()
  const [article] = await db
    .select({
      id: articles.id,
      authorId: articles.authorId,
      deletedAt: articles.deletedAt,
    })
    .from(articles)
    .where(eq(articles.id, articleId))
    .limit(1)

  if (!article || article.deletedAt) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 })
  }

  if (!can(guard.user, "article.read_all") && article.authorId !== guard.user?.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const versions = await db
    .select({
      id: articleVersions.id,
      versionNumber: articleVersions.versionNumber,
      reason: articleVersions.reason,
      snapshot: articleVersions.snapshot,
      createdAt: articleVersions.createdAt,
      createdByName: users.name,
    })
    .from(articleVersions)
    .leftJoin(users, eq(articleVersions.createdBy, users.id))
    .where(eq(articleVersions.articleId, articleId))
    .orderBy(desc(articleVersions.versionNumber))
    .limit(50)

  return NextResponse.json({
    versions: versions.map((version) => ({
      ...version,
      createdAt: version.createdAt.toISOString(),
      createdByName: version.createdByName ?? "System",
    })),
  })
}
