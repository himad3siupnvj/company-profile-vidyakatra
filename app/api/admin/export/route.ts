import { asc, desc, eq, isNull } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/db"
import {
  articleCategories,
  articles,
  assets,
  divisions,
  members,
  organizationalUnits,
  periods,
  users,
} from "@/db/schema"
import { requireApiPermission } from "@/lib/api-guard"
import { writeAuditLog } from "@/lib/audit"
import { toCsv } from "@/lib/csv"
import { createZip } from "@/lib/zip"

export const runtime = "nodejs"

const exportEntities = ["periods", "members", "users", "organizational-units", "divisions", "articles", "assets"] as const

type ExportEntity = (typeof exportEntities)[number]

function isExportEntity(value: string): value is ExportEntity {
  return (exportEntities as readonly string[]).includes(value)
}

async function getRows(entity: ExportEntity) {
  const db = getDb()

  if (entity === "periods") {
    return db.select().from(periods).orderBy(asc(periods.name))
  }

  if (entity === "members") {
    return db.select().from(members).where(isNull(members.deletedAt)).orderBy(asc(members.sortOrder), asc(members.name))
  }

  if (entity === "users") {
    const rows = await db.select().from(users).orderBy(desc(users.createdAt))

    return rows.map(({ passwordHash, claimCode, ...row }) => row)
  }

  if (entity === "organizational-units") {
    return db.select().from(organizationalUnits).where(isNull(organizationalUnits.deletedAt)).orderBy(asc(organizationalUnits.sortOrder), asc(organizationalUnits.name))
  }

  if (entity === "divisions") {
    return db.select().from(divisions).where(isNull(divisions.deletedAt)).orderBy(asc(divisions.sortOrder), asc(divisions.name))
  }

  if (entity === "articles") {
    return db
      .select({
        id: articles.id,
        title: articles.title,
        slug: articles.slug,
        excerpt: articles.excerpt,
        categoryId: articles.categoryId,
        categoryName: articleCategories.name,
        status: articles.status,
        authorName: articles.authorName,
        readTime: articles.readTime,
        views: articles.views,
        isFeatured: articles.isFeatured,
        publishedAt: articles.publishedAt,
        createdAt: articles.createdAt,
        updatedAt: articles.updatedAt,
      })
      .from(articles)
      .leftJoin(articleCategories, eq(articles.categoryId, articleCategories.id))
      .where(isNull(articles.deletedAt))
  }

  return db.select().from(assets).where(isNull(assets.deletedAt)).orderBy(desc(assets.createdAt))
}

export async function GET(request: NextRequest) {
  const guard = await requireApiPermission("data.export")
  if (guard.response) return guard.response

  const format = request.nextUrl.searchParams.get("format") === "zip" ? "zip" : "csv"
  const entityParam = request.nextUrl.searchParams.get("entity") ?? "members"
  const entityList = (request.nextUrl.searchParams.get("entities") ?? entityParam)
    .split(",")
    .map((entity) => entity.trim())
    .filter(Boolean)
  const entities = entityList.filter(isExportEntity)

  if (!entities.length) {
    return NextResponse.json({ error: "Valid export entity is required" }, { status: 400 })
  }

  if (format === "zip") {
    const files = await Promise.all(
      entities.map(async (entity) => ({
        name: `${entity}.csv`,
        content: toCsv((await getRows(entity)) as Array<Record<string, unknown>>),
      })),
    )
    const zip = createZip(files)

    await writeAuditLog({
      actorId: guard.user?.id,
      action: "export.data",
      entityType: "export",
      metadata: { format, entities },
    })

    return new NextResponse(zip, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="cms-export-${new Date().toISOString().slice(0, 10)}.zip"`,
      },
    })
  }

  const entity = entities[0]
  const csv = toCsv((await getRows(entity)) as Array<Record<string, unknown>>)

  await writeAuditLog({
    actorId: guard.user?.id,
    action: "export.data",
    entityType: entity,
    metadata: { format, entity },
  })

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${entity}-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  })
}
