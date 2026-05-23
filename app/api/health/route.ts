import { NextResponse } from "next/server"

export function GET() {
  return NextResponse.json({
    ok: true,
    service: "vidyakatra-cms",
    databaseConfigured: Boolean(process.env.DATABASE_URL),
  })
}
