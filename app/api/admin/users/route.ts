import { randomBytes } from "crypto"
import { desc, eq } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/db"
import { members, users } from "@/db/schema"
import { requireApiPermission } from "@/lib/api-guard"
import { writeAuditLog } from "@/lib/audit"
import { userRoles, type UserRole } from "@/lib/permissions"

export const runtime = "nodejs"

function isUserRole(value: unknown): value is UserRole {
  return typeof value === "string" && (userRoles as readonly string[]).includes(value)
}

function serializeUser(row: typeof users.$inferSelect) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    status: row.status,
    claimCode: row.status === "unclaimed" ? row.claimCode : null,
    lastLogin: row.lastLoginAt ? row.lastLoginAt.toISOString().slice(0, 16).replace("T", " ") : "-",
    createdAt: row.createdAt.toISOString().slice(0, 10),
    avatar: "",
  }
}

async function hasAnotherAdministrator(currentUserId: string) {
  const db = getDb()
  const administratorRows = await db
    .select({ id: users.id, role: users.role, status: users.status })
    .from(users)

  return administratorRows.some(
    (user) => user.id !== currentUserId && user.role === "administrator" && user.status === "active",
  )
}

export async function GET() {
  const guard = await requireApiPermission("user.manage")
  if (guard.response) return guard.response

  const db = getDb()
  const rows = await db.select().from(users).orderBy(desc(users.createdAt))

  return NextResponse.json({ users: rows.map(serializeUser) })
}

export async function POST(request: NextRequest) {
  const guard = await requireApiPermission("user.manage")
  if (guard.response) return guard.response

  const payload = await request.json()
  const name = String(payload.name ?? "").trim()
  const email = String(payload.email ?? "").trim().toLowerCase()
  const memberId = String(payload.memberId ?? "").trim()

  if (!name || !email || !memberId) {
    return NextResponse.json({ error: "Member, name, and email are required" }, { status: 400 })
  }

  if (!isUserRole(payload.role)) {
    return NextResponse.json({ error: "Valid role is required" }, { status: 400 })
  }

  const db = getDb()
  const [member] = await db.select().from(members).where(eq(members.id, memberId)).limit(1)

  if (!member) {
    return NextResponse.json({ error: "Linked member is required" }, { status: 400 })
  }

  const now = new Date()
  const claimCode = randomBytes(4).toString("hex").toUpperCase()

  try {
    const [created] = await db
      .insert(users)
      .values({
        name,
        email,
        passwordHash: null,
        claimCode,
        role: payload.role,
        memberId,
        status: "unclaimed",
        createdAt: now,
        updatedAt: now,
      })
      .returning()

    await writeAuditLog({
      actorId: guard.user?.id,
      action: "user.create",
      entityType: "user",
      entityId: created.id,
      metadata: { role: created.role, status: created.status, memberId },
    })

    return NextResponse.json({ user: serializeUser(created) })
  } catch {
    return NextResponse.json({ error: "Email is already used" }, { status: 409 })
  }
}

export async function PATCH(request: NextRequest) {
  const guard = await requireApiPermission("user.manage")
  if (guard.response) return guard.response

  const payload = await request.json()
  const id = String(payload.id ?? "")
  const status = payload.status === "inactive" ? "inactive" : payload.status === "active" ? "active" : null

  if (!id || !status) {
    return NextResponse.json({ error: "Valid id and status are required" }, { status: 400 })
  }

  const db = getDb()
  const [existing] = await db.select().from(users).where(eq(users.id, id)).limit(1)

  if (!existing) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  if (existing.role === "administrator" && status === "inactive" && !(await hasAnotherAdministrator(id))) {
    return NextResponse.json({ error: "At least one administrator must stay active" }, { status: 400 })
  }

  if (status === "active" && !existing.passwordHash) {
    return NextResponse.json({ error: "Unclaimed users must claim their account before activation" }, { status: 400 })
  }

  const [updated] = await db
    .update(users)
    .set({ status, updatedAt: new Date() })
    .where(eq(users.id, id))
    .returning()

  await writeAuditLog({
    actorId: guard.user?.id,
    action: status === "inactive" ? "user.disable" : "user.enable",
    entityType: "user",
    entityId: id,
    metadata: { previousStatus: existing.status, newStatus: status },
  })

  return NextResponse.json({ user: serializeUser(updated) })
}

export async function DELETE(request: NextRequest) {
  const guard = await requireApiPermission("user.manage")
  if (guard.response) return guard.response

  const id = request.nextUrl.searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "Valid id is required" }, { status: 400 })
  }

  const db = getDb()
  const [existing] = await db.select().from(users).where(eq(users.id, id)).limit(1)

  if (!existing) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  if (existing.role === "administrator" && !(await hasAnotherAdministrator(id))) {
    return NextResponse.json({ error: "At least one administrator must stay active" }, { status: 400 })
  }

  await db.update(users).set({ status: "inactive", updatedAt: new Date() }).where(eq(users.id, id))
  await writeAuditLog({
    actorId: guard.user?.id,
    action: "user.disable",
    entityType: "user",
    entityId: id,
    metadata: { previousStatus: existing.status, newStatus: "inactive" },
  })

  return NextResponse.json({ ok: true })
}
