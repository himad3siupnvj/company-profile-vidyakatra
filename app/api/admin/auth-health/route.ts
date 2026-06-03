import { sql } from "drizzle-orm"
import { NextResponse } from "next/server"
import { getDb } from "@/db"
import { users } from "@/db/schema"
import { requireApiPermission } from "@/lib/api-guard"

export const runtime = "nodejs"

type UserStatus = "unclaimed" | "active" | "inactive"

const checks = [
  { key: "DATABASE_URL", label: "Database URL", required: true },
  { key: "JWT_SECRET", label: "JWT secret", required: true },
  { key: "SUPABASE_URL", label: "Supabase URL", required: true },
  { key: "SUPABASE_SERVICE_ROLE_KEY", label: "Supabase service role key", required: true },
  { key: "SUPABASE_STORAGE_BUCKET", label: "Supabase storage bucket", required: true },
] as const

export async function GET() {
  const guard = await requireApiPermission("user.manage")
  if (guard.response) return guard.response

  const env = checks.map((check) => ({
    key: check.key,
    label: check.label,
    required: check.required,
    configured: Boolean(process.env[check.key]),
  }))

  const db = getDb()
  const startedAt = Date.now()
  let database = {
    ok: false,
    latencyMs: null as number | null,
    serverTime: null as string | null,
    error: null as string | null,
  }
  let userStats: Record<UserStatus, number> = {
    unclaimed: 0,
    active: 0,
    inactive: 0,
  }

  try {
    const ping = await db.execute(sql`select now() as now`)
    const rows = await db
      .select({
        status: users.status,
        count: sql<number>`count(*)::int`,
      })
      .from(users)
      .groupBy(users.status)

    userStats = rows.reduce<Record<UserStatus, number>>(
      (acc, row) => {
        acc[row.status] = Number(row.count)
        return acc
      },
      { unclaimed: 0, active: 0, inactive: 0 },
    )

    database = {
      ok: true,
      latencyMs: Date.now() - startedAt,
      serverTime: String(ping[0]?.now ?? ""),
      error: null,
    }
  } catch (error) {
    database = {
      ok: false,
      latencyMs: Date.now() - startedAt,
      serverTime: null,
      error: error instanceof Error ? error.message : "Database check failed",
    }
  }

  const missingRequired = env.filter((item) => item.required && !item.configured).map((item) => item.key)

  return NextResponse.json({
    ok: database.ok && missingRequired.length === 0,
    checkedAt: new Date().toISOString(),
    env,
    database,
    users: {
      total: userStats.unclaimed + userStats.active + userStats.inactive,
      byStatus: userStats,
    },
  })
}
