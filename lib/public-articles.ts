import { and, desc, eq, isNull } from "drizzle-orm"
import { getDb } from "@/db"
import { articleCategories, articles } from "@/db/schema"
import { getArticleReadTime, normalizeArticleDocument } from "@/lib/article-content"
import { newsData, type PublicNews } from "@/lib/public-content"

function formatPublicDate(value: Date | null) {
  const date = value ?? new Date()

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date)
}

function getDocumentParagraphs(document: ReturnType<typeof normalizeArticleDocument>) {
  return document.content
    .filter((block) => block.type !== "image")
    .map((block) => block.text)
    .filter(Boolean)
}

async function getPublishedArticleRows() {
  const db = getDb()

  return db
    .select({
      id: articles.id,
      slug: articles.slug,
      title: articles.title,
      excerpt: articles.excerpt,
      content: articles.content,
      categoryName: articleCategories.name,
      categorySlug: articleCategories.slug,
      authorName: articles.authorName,
      publishedAt: articles.publishedAt,
      createdAt: articles.createdAt,
      thumbnailUrl: articles.thumbnailUrl,
      readTime: articles.readTime,
      isFeatured: articles.isFeatured,
    })
    .from(articles)
    .leftJoin(articleCategories, eq(articles.categoryId, articleCategories.id))
    .where(and(eq(articles.status, "published"), isNull(articles.deletedAt)))
    .orderBy(desc(articles.publishedAt), desc(articles.createdAt))
}

function serializePublicArticle(row: Awaited<ReturnType<typeof getPublishedArticleRows>>[number]): PublicNews {
  const document = normalizeArticleDocument(row.content, row.excerpt ?? "")
  const category = row.categorySlug ?? "berita"

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? "",
    content: getDocumentParagraphs(document),
    document,
    date: formatPublicDate(row.publishedAt ?? row.createdAt),
    readTime: row.readTime ?? getArticleReadTime(document),
    author: row.authorName ?? "Tim Media",
    category: category === "kegiatan" || category === "pengumuman" || category === "prestasi" ? category : "berita",
    image: row.thumbnailUrl ?? "/news/default.jpg",
    featured: row.isFeatured,
  }
}

export async function getPublicNews() {
  try {
    const rows = await getPublishedArticleRows()

    if (rows.length) {
      return rows.map(serializePublicArticle)
    }
  } catch {
    // Public pages stay available with curated fallback content when the database is unavailable.
  }

  return newsData
}

export async function getPublicNewsBySlug(slug: string) {
  const news = await getPublicNews()

  return news.find((item) => item.slug === slug)
}
