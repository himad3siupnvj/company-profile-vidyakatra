import { asc, eq, isNull } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/db"
import { divisions, members, organizationalUnits } from "@/db/schema"
import { requireApiPermission } from "@/lib/api-guard"

export const runtime = "nodejs"

function serializeOrgUnit(row: typeof organizationalUnits.$inferSelect & { memberCount?: number; head?: string }) {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    description: row.description ?? "",
    head: row.head ?? "-",
    memberCount: row.memberCount ?? 0,
    color: row.color ?? "bg-primary",
  }
}

function serializeDivision(row: typeof divisions.$inferSelect & { unitName?: string | null }) {
  return {
    id: row.id,
    name: row.name,
    organizationalUnit: row.unitName ?? "Unassigned",
    description: row.description ?? "",
    sortOrder: row.sortOrder,
  }
}

function serializeMember(row: {
  id: string
  name: string
  position: string
  unitName: string | null
  divisionName: string | null
  email: string | null
  phone: string | null
  avatarUrl: string | null
  joinedAt: Date | null
  createdAt: Date
}) {
  return {
    id: row.id,
    name: row.name,
    position: row.position,
    department: row.unitName ?? "Unassigned",
    division: row.divisionName ?? "",
    email: row.email ?? "",
    phone: row.phone ?? "",
    avatar: row.avatarUrl ?? "",
    status: "active" as const,
    joinDate: (row.joinedAt ?? row.createdAt).toISOString().slice(0, 10),
  }
}

export async function GET() {
  const guard = await requireApiPermission("member.manage")
  if (guard.response) return guard.response

  const db = getDb()
  const orgUnitRows = await db
    .select()
    .from(organizationalUnits)
    .where(isNull(organizationalUnits.deletedAt))
    .orderBy(asc(organizationalUnits.sortOrder), asc(organizationalUnits.id))
  const divisionRows = await db
    .select({
      id: divisions.id,
      name: divisions.name,
      organizationalUnitId: divisions.organizationalUnitId,
      periodId: divisions.periodId,
      description: divisions.description,
      sortOrder: divisions.sortOrder,
      createdAt: divisions.createdAt,
      updatedAt: divisions.updatedAt,
      deletedAt: divisions.deletedAt,
      deletedBy: divisions.deletedBy,
      unitName: organizationalUnits.name,
    })
    .from(divisions)
    .leftJoin(organizationalUnits, eq(divisions.organizationalUnitId, organizationalUnits.id))
    .where(isNull(divisions.deletedAt))
    .orderBy(asc(divisions.sortOrder), asc(divisions.id))
  const memberRows = await db
    .select({
      id: members.id,
      name: members.name,
      position: members.position,
      unitName: organizationalUnits.name,
      divisionName: divisions.name,
      email: members.email,
      phone: members.phone,
      avatarUrl: members.avatarUrl,
      joinedAt: members.joinedAt,
      createdAt: members.createdAt,
    })
    .from(members)
    .leftJoin(organizationalUnits, eq(members.organizationalUnitId, organizationalUnits.id))
    .leftJoin(divisions, eq(members.divisionId, divisions.id))
    .where(isNull(members.deletedAt))
    .orderBy(asc(members.sortOrder), asc(members.id))

  const unitSummaries = orgUnitRows.map((unit) => {
    const unitMembers = memberRows.filter((member) => member.unitName === unit.name)
    const head = unitMembers.find((member) => /ketua|koordinator|kepala|head/i.test(member.position))?.name

    return serializeOrgUnit({
      ...unit,
      head,
      memberCount: unitMembers.length,
    })
  })

  return NextResponse.json({
    organizationalUnits: unitSummaries,
    departments: unitSummaries,
    divisions: divisionRows.map(serializeDivision),
    members: memberRows.map(serializeMember),
  })
}

export async function POST(request: NextRequest) {
  const guard = await requireApiPermission("member.manage")
  if (guard.response) return guard.response

  const payload = await request.json()
  const type = String(payload.type ?? "member")

  if (type !== "member") {
    return NextResponse.json({ error: "Unsupported organization payload" }, { status: 400 })
  }

  const name = String(payload.name ?? "").trim()
  const position = String(payload.position ?? "").trim()

  if (!name || !position) {
    return NextResponse.json({ error: "Name and position are required" }, { status: 400 })
  }

  const db = getDb()
  const [unit] = payload.department
    ? await db
        .select()
        .from(organizationalUnits)
        .where(eq(organizationalUnits.name, String(payload.department)))
        .limit(1)
    : []
  const now = new Date()

  const [created] = await db
    .insert(members)
    .values({
      name,
      position,
      organizationalUnitId: unit?.id,
      email: String(payload.email ?? ""),
      phone: String(payload.phone ?? ""),
      joinedAt: now,
      createdAt: now,
      updatedAt: now,
    })
    .returning()

  return NextResponse.json({
    member: serializeMember({
      ...created,
      unitName: unit?.name ?? null,
      divisionName: null,
    }),
  })
}

export async function DELETE(request: NextRequest) {
  const guard = await requireApiPermission("member.manage")
  if (guard.response) return guard.response

  const id = request.nextUrl.searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "Valid id is required" }, { status: 400 })
  }

  const db = getDb()
  await db.update(members).set({ deletedAt: new Date(), updatedAt: new Date() }).where(eq(members.id, id))

  return NextResponse.json({ ok: true })
}
