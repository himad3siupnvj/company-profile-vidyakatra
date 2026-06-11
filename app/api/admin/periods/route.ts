import { asc, eq, ne, sql } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/db"
import { periods } from "@/db/schema"
import { requireApiPermission } from "@/lib/api-guard"
import { writeAuditLog } from "@/lib/audit"

export const runtime = "nodejs"

type PeriodStatus = "upcoming" | "active" | "archived"

function isPeriodStatus(value: unknown): value is PeriodStatus {
  return value === "upcoming" || value === "active" || value === "archived"
}

function serializePeriod(row: typeof periods.$inferSelect) {
  return {
    id: row.id,
    name: row.name,
    status: row.status,
    startDate: row.startDate,
    endDate: row.endDate,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }
}

export async function GET() {
  const guard = await requireApiPermission("period.manage")
  if (guard.response) return guard.response

  const db = getDb()
  const rows = await db.select().from(periods).orderBy(asc(periods.name))

  return NextResponse.json({ periods: rows.map(serializePeriod) })
}

export async function POST(request: NextRequest) {
  const guard = await requireApiPermission("period.manage")
  if (guard.response) return guard.response

  const payload = await request.json()
  const name = String(payload.name ?? "").trim()
  const status = isPeriodStatus(payload.status) ? payload.status : "upcoming"

  if (!name) {
    return NextResponse.json({ error: "Period name is required" }, { status: 400 })
  }

  const now = new Date()
  const db = getDb()
  const created = await db.transaction(async (tx) => {
    if (status === "active") {
      await tx.execute(sql`select pg_advisory_xact_lock(hashtext('cms-active-period'))`)
      await tx
        .update(periods)
        .set({ status: "archived", updatedAt: now })
        .where(eq(periods.status, "active"))
    }

    const [row] = await tx
      .insert(periods)
      .values({
        name,
        status,
        startDate: payload.startDate || null,
        endDate: payload.endDate || null,
        createdAt: now,
        updatedAt: now,
      })
      .returning()

    return row
  })

  await writeAuditLog({
    actorId: guard.user?.id,
    action: "period.create",
    entityType: "period",
    entityId: created.id,
    metadata: { status },
  })

  return NextResponse.json({ period: serializePeriod({ ...created, status }) })
}

export async function PUT(request: NextRequest) {
  const guard = await requireApiPermission("period.manage")
  if (guard.response) return guard.response

  const payload = await request.json()
  const id = String(payload.id ?? "")
  const name = String(payload.name ?? "").trim()
  const status = isPeriodStatus(payload.status) ? payload.status : null

  if (!id || !name || !status) {
    return NextResponse.json({ error: "Valid id, name, and status are required" }, { status: 400 })
  }

  const db = getDb()
  const updated = await db.transaction(async (tx) => {
    const now = new Date()

    if (status === "active") {
      await tx.execute(sql`select pg_advisory_xact_lock(hashtext('cms-active-period'))`)
      await tx
        .update(periods)
        .set({ status: "archived", updatedAt: now })
        .where(ne(periods.id, id))
    }

    const [row] = await tx
      .update(periods)
      .set({
        name,
        status,
        startDate: payload.startDate || null,
        endDate: payload.endDate || null,
        updatedAt: now,
      })
      .where(eq(periods.id, id))
      .returning()

    return row
  })

  if (!updated) {
    return NextResponse.json({ error: "Period not found" }, { status: 404 })
  }

  await writeAuditLog({
    actorId: guard.user?.id,
    action: "period.update",
    entityType: "period",
    entityId: id,
    metadata: { status },
  })

  return NextResponse.json({ period: serializePeriod(updated) })
}

export async function DELETE(request: NextRequest) {
  const guard = await requireApiPermission("period.manage")
  if (guard.response) return guard.response

  const id = request.nextUrl.searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "Valid id is required" }, { status: 400 })
  }

  const db = getDb()
  const [updated] = await db
    .update(periods)
    .set({ status: "archived", updatedAt: new Date() })
    .where(eq(periods.id, id))
    .returning()

  if (!updated) {
    return NextResponse.json({ error: "Period not found" }, { status: 404 })
  }

  await writeAuditLog({
    actorId: guard.user?.id,
    action: "period.archive",
    entityType: "period",
    entityId: id,
  })

  return NextResponse.json({ period: serializePeriod(updated) })
}
