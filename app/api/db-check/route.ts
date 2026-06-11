import { sql } from "drizzle-orm"
import { NextResponse } from "next/server"
import { getDb } from "@/db"
import { requireApiPermission } from "@/lib/api-guard"

export const runtime = "nodejs"

export async function GET() {
  const guard = await requireApiPermission("user.manage")
  if (guard.response) return guard.response

  const db = getDb()
  const result = await db.execute(sql`select now() as now`)

  return NextResponse.json({
    ok: true,
    now: result[0]?.now,
  })
}
