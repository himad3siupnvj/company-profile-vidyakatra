import { desc, isNull } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/db"
import { assets, auditLogs } from "@/db/schema"
import { requireApiPermission } from "@/lib/api-guard"
import {
  createStoragePath,
  uploadFileToStorage,
  validateUploadFile,
  type StoragePathContext,
  type UploadPurpose,
} from "@/lib/storage"

export const runtime = "nodejs"

function isUploadPurpose(value: unknown): value is UploadPurpose {
  return value === "article-image" || value === "article-source"
}

function serializeAsset(row: typeof assets.$inferSelect) {
  return {
    id: row.id,
    url: row.url,
    fileName: row.fileName,
    mimeType: row.mimeType,
    sizeBytes: row.sizeBytes,
    createdAt: row.createdAt.toISOString(),
  }
}

function getOptionalString(formData: FormData, key: string) {
  const value = formData.get(key)

  return typeof value === "string" && value.trim() ? value.trim() : null
}

function getStoragePathContext(formData: FormData): StoragePathContext {
  return {
    year: getOptionalString(formData, "year"),
    section: getOptionalString(formData, "section"),
    category: getOptionalString(formData, "category"),
    kind: getOptionalString(formData, "kind"),
  }
}

export async function GET() {
  const guard = await requireApiPermission("media.manage")
  if (guard.response) return guard.response

  const db = getDb()
  const rows = await db
    .select()
    .from(assets)
    .where(isNull(assets.deletedAt))
    .orderBy(desc(assets.createdAt))
    .limit(50)

  return NextResponse.json({ assets: rows.map(serializeAsset) })
}

export async function POST(request: NextRequest) {
  const guard = await requireApiPermission("media.upload")
  if (guard.response) return guard.response

  const formData = await request.formData()
  const file = formData.get("file")
  const purpose = formData.get("purpose")

  if (!(file instanceof File) || !isUploadPurpose(purpose)) {
    return NextResponse.json({ error: "Valid file and purpose are required" }, { status: 400 })
  }

  const validation = validateUploadFile(file, purpose)

  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 })
  }

  const path = createStoragePath(file, purpose, getStoragePathContext(formData))

  try {
    const url = await uploadFileToStorage(file, path)
    const now = new Date()
    const db = getDb()
    const [created] = await db
      .insert(assets)
      .values({
        url,
        fileName: file.name,
        mimeType: file.type || "application/octet-stream",
        sizeBytes: file.size,
        uploadedBy: guard.user?.id ?? null,
        createdAt: now,
      })
      .returning()

    await db.insert(auditLogs).values({
      actorId: guard.user?.id ?? null,
      action: "media.upload",
      entityType: "asset",
      entityId: created.id,
      metadata: {
        purpose,
        path,
        fileName: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
      },
      createdAt: now,
    })

    return NextResponse.json({ asset: { ...serializeAsset(created), path, purpose } })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload gagal."

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
