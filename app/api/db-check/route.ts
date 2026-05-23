import { sql } from "drizzle-orm"
import { NextResponse } from "next/server"
import { getDb } from "@/db"

export const runtime = "nodejs"

export async function GET() {
  const db = getDb()
  const result = await db.execute(sql`select now() as now`)

  return NextResponse.json({
    ok: true,
    now: result[0]?.now,
  })
}
