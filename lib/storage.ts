const imageMaxBytes = 1 * 1024 * 1024
const sourceMaxBytes = 10 * 1024 * 1024

const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"])
const allowedSourceTypes = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
])

export type UploadPurpose = "article-image" | "article-source"

export type StoragePathContext = {
  year?: number | string | null
  section?: string | null
  category?: string | null
  kind?: string | null
}

type DefaultStoragePathContext = {
  year: number
  section: string
  category: string
  kind: string
}

export function validateUploadFile(file: File, purpose: UploadPurpose) {
  if (purpose === "article-image") {
    if (!allowedImageTypes.has(file.type)) {
      return { ok: false as const, error: "File gambar harus JPEG, PNG, WebP, atau GIF." }
    }

    if (file.size > imageMaxBytes) {
      return { ok: false as const, error: "Ukuran gambar maksimal 1 MB." }
    }
  }

  if (purpose === "article-source") {
    if (!allowedSourceTypes.has(file.type)) {
      return { ok: false as const, error: "Source berita acara harus PDF, DOC, atau DOCX." }
    }

    if (file.size > sourceMaxBytes) {
      return { ok: false as const, error: "Ukuran source berita acara maksimal 10 MB." }
    }
  }

  return { ok: true as const }
}

function getStorageConfig() {
  const supabaseUrl = process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const bucket = process.env.SUPABASE_STORAGE_BUCKET

  if (!supabaseUrl || !serviceRoleKey || !bucket) {
    throw new Error("Supabase Storage config is missing")
  }

  return {
    supabaseUrl: supabaseUrl.replace(/\/$/, ""),
    serviceRoleKey,
    bucket,
  }
}

function sanitizeFileName(fileName: string) {
  const [name, ...extensionParts] = fileName.split(".")
  const extension = extensionParts.length ? `.${extensionParts.pop()}` : ""
  const safeName = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80)

  return `${safeName || "upload"}${extension.toLowerCase()}`
}

function sanitizePathSegment(value: unknown, fallback: string) {
  if (typeof value !== "string" && typeof value !== "number") return fallback

  const safeSegment = String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48)

  return safeSegment || fallback
}

function getDefaultPathContext(purpose: UploadPurpose): DefaultStoragePathContext {
  const year = new Date().getFullYear()

  if (purpose === "article-source") {
    return {
      year,
      section: "articles",
      category: "berita-acara",
      kind: "source",
    }
  }

  return {
    year,
    section: "articles",
    category: "general",
    kind: "image",
  }
}

export function createStoragePath(file: File, purpose: UploadPurpose, context: StoragePathContext = {}) {
  const defaults = getDefaultPathContext(purpose)
  const year = sanitizePathSegment(context.year ?? defaults.year, String(defaults.year))
  const section = sanitizePathSegment(context.section ?? defaults.section, defaults.section)
  const category = sanitizePathSegment(context.category ?? defaults.category, defaults.category)
  const kind = sanitizePathSegment(context.kind ?? defaults.kind, defaults.kind)

  return `${year}/${section}/${category}/${kind}/${crypto.randomUUID()}-${sanitizeFileName(file.name)}`
}

export async function uploadFileToStorage(file: File, path: string) {
  const { supabaseUrl, serviceRoleKey, bucket } = getStorageConfig()
  const uploadUrl = `${supabaseUrl}/storage/v1/object/${bucket}/${path}`
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15_000)
  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": file.type || "application/octet-stream",
      "x-upsert": "false",
    },
    body: Buffer.from(await file.arrayBuffer()),
    signal: controller.signal,
  }).finally(() => clearTimeout(timeout))

  if (!response.ok) {
    const errorText = await response.text().catch(() => "")
    throw new Error(errorText || "Storage upload failed")
  }

  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`
}
