import { sql, type InferSelectModel, type SQL } from "drizzle-orm"
import type { articles } from "@/db/schema"

type Article = InferSelectModel<typeof articles>

export type ArticleVersionReason = "major_update" | "publish"

export function createArticleSnapshot(article: Article) {
  return {
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    content: article.content,
    categoryId: article.categoryId,
    status: article.status,
    authorId: article.authorId,
    authorName: article.authorName,
    reviewerId: article.reviewerId,
    organizationalUnitId: article.organizationalUnitId,
    divisionId: article.divisionId,
    periodId: article.periodId,
    thumbnailUrl: article.thumbnailUrl,
    thumbnailAlt: article.thumbnailAlt,
    seoTitle: article.seoTitle,
    seoDescription: article.seoDescription,
    canonicalUrl: article.canonicalUrl,
    ogImageUrl: article.ogImageUrl,
    readTime: article.readTime,
    views: article.views,
    isFeatured: article.isFeatured,
    rejectedNote: article.rejectedNote,
    publishedAt: article.publishedAt?.toISOString() ?? null,
    createdAt: article.createdAt.toISOString(),
    updatedAt: article.updatedAt.toISOString(),
  }
}

type SqlExecutor = {
  execute: (query: SQL) => Promise<unknown>
}

export async function saveArticleVersion(
  executor: SqlExecutor,
  article: Article,
  actorId: string | null,
  reason: ArticleVersionReason,
) {
  const snapshot = JSON.stringify(createArticleSnapshot(article))

  await executor.execute(
    sql`select pg_advisory_xact_lock(hashtext(${"article-version:" + article.id}))`,
  )
  await executor.execute(sql`
    insert into article_versions (
      article_id,
      version_number,
      reason,
      snapshot,
      created_by,
      created_at
    )
    select
      ${article.id}::uuid,
      coalesce(max(version_number), 0) + 1,
      ${reason},
      ${snapshot}::jsonb,
      ${actorId}::uuid,
      now()
    from article_versions
    where article_id = ${article.id}::uuid
  `)
}
