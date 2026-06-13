import { readFileSync } from "node:fs"
import { applicationDefault, cert, getApps, initializeApp } from "firebase-admin/app"
import { getFirestore, Timestamp } from "firebase-admin/firestore"
import postgres from "postgres"

const collectionMap = [
  ["periods", "periods"],
  ["request_rate_limits", "requestRateLimits"],
  ["members", "members"],
  ["users", "users"],
  ["organizational_units", "organizationalUnits"],
  ["divisions", "divisions"],
  ["article_categories", "articleCategories"],
  ["articles", "articles"],
  ["article_versions", "articleVersions"],
  ["assets", "assets"],
  ["site_settings", "siteSettings"],
  ["audit_logs", "auditLogs"],
]

function loadEnvFile() {
  try {
    const text = readFileSync(".env", "utf8")
    for (const line of text.split(/\r?\n/)) {
      const match = line.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/)
      if (!match || process.env[match[1]]) continue
      process.env[match[1]] = match[2].replace(/^["']|["']$/g, "")
    }
  } catch {
    // Environment variables may already be supplied by the runtime.
  }
}

function toCamelCase(key) {
  return key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

function convertValue(value) {
  if (value instanceof Date) return Timestamp.fromDate(value)
  if (Array.isArray(value)) return value.map(convertValue)
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [
        toCamelCase(key),
        convertValue(nestedValue),
      ]),
    )
  }
  return value
}

function getFirebaseCredential() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    return cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON))
  }
  return applicationDefault()
}

loadEnvFile()

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required for the source database")
if (!process.env.FIREBASE_PROJECT_ID) throw new Error("FIREBASE_PROJECT_ID is required")

const shouldApply = process.argv.includes("--apply")
const sql = postgres(process.env.DATABASE_URL, {
  max: 1,
  connect_timeout: 15,
  idle_timeout: 5,
  prepare: false,
  ssl: "require",
})

const app =
  getApps()[0] ??
  initializeApp({
    credential: getFirebaseCredential(),
    projectId: process.env.FIREBASE_PROJECT_ID,
  })
const firestore = getFirestore(app)
firestore.settings({ ignoreUndefinedProperties: true })

try {
  const summary = {}

  for (const [table, collection] of collectionMap) {
    const rows = await sql.unsafe(`select * from "${table}"`)
    summary[collection] = rows.length

    if (!shouldApply) continue

    for (let offset = 0; offset < rows.length; offset += 400) {
      const batch = firestore.batch()
      for (const row of rows.slice(offset, offset + 400)) {
        const id = String(row.id ?? row.bucket_key ?? row.key)
        const data = convertValue(row)
        delete data.id
        batch.set(firestore.collection(collection).doc(id), data, { merge: true })
      }
      await batch.commit()
    }
  }

  console.log(JSON.stringify({ mode: shouldApply ? "applied" : "preview", summary }, null, 2))
} finally {
  await sql.end({ timeout: 2 })
}

