import { NextResponse } from "next/server"

function isPlaceholder(value: string | undefined, placeholders: string[]) {
  if (!value) return true

  return placeholders.some((placeholder) => value.includes(placeholder))
}

export function GET() {
  const isProduction = process.env.NODE_ENV === "production"
  const databaseConfigured = Boolean(process.env.DATABASE_URL)
  const authConfigured = Boolean(process.env.JWT_SECRET)
  const storageConfigured = Boolean(
    process.env.SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      process.env.SUPABASE_STORAGE_BUCKET,
  )
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  const configurationIssues = [
    !databaseConfigured && "DATABASE_URL is missing",
    !authConfigured && "JWT_SECRET is missing",
    process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32 && "JWT_SECRET is too short",
    isPlaceholder(process.env.JWT_SECRET, ["replace-with", "development-only"]) && "JWT_SECRET uses a placeholder",
    !storageConfigured && "Supabase storage config is incomplete",
    isPlaceholder(process.env.SUPABASE_SERVICE_ROLE_KEY, ["replace-with", "your-"]) &&
      "SUPABASE_SERVICE_ROLE_KEY uses a placeholder",
    isProduction && (!siteUrl || siteUrl.includes("localhost")) && "NEXT_PUBLIC_SITE_URL must be the production URL",
  ].filter(Boolean)

  const response = {
    ok: configurationIssues.length === 0,
    service: "vidyakatra-cms",
    ...(isProduction
      ? {}
      : {
          databaseConfigured,
          authConfigured,
          storageConfigured,
          configurationIssues,
        }),
  }

  return NextResponse.json(response, {
    status: response.ok ? 200 : 503,
    headers: { "Cache-Control": "no-store" },
  })
}
