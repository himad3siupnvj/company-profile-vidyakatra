const imageMaxBytes = 1 * 1024 * 1024
const sourceMaxBytes = 10 * 1024 * 1024

const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"])
const allowedSourceTypes = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
])

export type UploadPurpose = "article-image" | "article-source" | "organization-image"

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

function startsWith(bytes: Uint8Array, signature: number[]) {
  return signature.every((byte, index) => bytes[index] === byte)
}

async function hasValidFileSignature(file: File, purpose: UploadPurpose) {
  const bytes = new Uint8Array(await file.slice(0, 16).arrayBuffer())

  if (purpose === "article-image" || purpose === "organization-image") {
    if (file.type === "image/jpeg") return startsWith(bytes, [0xff, 0xd8, 0xff])
    if (file.type === "image/png") return startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
    if (file.type === "image/gif") {
      return startsWith(bytes, [0x47, 0x49, 0x46, 0x38, 0x37, 0x61]) ||
        startsWith(bytes, [0x47, 0x49, 0x46, 0x38, 0x39, 0x61])
    }
    if (file.type === "image/webp") {
      return startsWith(bytes, [0x52, 0x49, 0x46, 0x46]) &&
        String.fromCharCode(...bytes.slice(8, 12)) === "WEBP"
    }
  }

  if (purpose === "article-source") {
    if (file.type === "application/pdf") {
      return startsWith(bytes, [0x25, 0x50, 0x44, 0x46, 0x2d])
    }

    if (file.type === "application/msword") {
      return startsWith(bytes, [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1])
    }

    return startsWith(bytes, [0x50, 0x4b, 0x03, 0x04]) ||
      startsWith(bytes, [0x50, 0x4b, 0x05, 0x06]) ||
      startsWith(bytes, [0x50, 0x4b, 0x07, 0x08])
  }

  return false
}

export async function validateUploadFile(file: File, purpose: UploadPurpose) {
  if (purpose === "article-image" || purpose === "organization-image") {
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

  if (!(await hasValidFileSignature(file, purpose))) {
    return { ok: false as const, error: "Isi file tidak sesuai dengan format yang dipilih." }
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

  if (purpose === "organization-image") {
    return {
      year,
      section: "profile",
      category: "organization",
      kind: "unit",
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
