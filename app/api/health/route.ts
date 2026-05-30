import { NextResponse } from "next/server"

export function GET() {
  return NextResponse.json({
    ok: true,
    service: "vidyakatra-cms",
    databaseConfigured: Boolean(process.env.DATABASE_URL),
    authConfigured: Boolean(process.env.JWT_SECRET),
    storageConfigured: Boolean(
      process.env.SUPABASE_URL &&
        process.env.SUPABASE_SERVICE_ROLE_KEY &&
        process.env.SUPABASE_STORAGE_BUCKET,
    ),
  })
}
