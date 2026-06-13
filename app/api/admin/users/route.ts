import { randomBytes } from "crypto"
import { desc, eq, sql } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/db"
import { users } from "@/db/schema"
import { requireApiPermission } from "@/lib/api-guard"
import { writeAuditLog } from "@/lib/audit"

export const runtime = "nodejs"

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
  }
}

class LastAdministratorError extends Error {}

async function assertAnotherAdministrator(
  tx: Parameters<Parameters<ReturnType<typeof getDb>["transaction"]>[0]>[0],
  currentUserId: string,
) {
  await tx.execute(sql`select pg_advisory_xact_lock(hashtext('cms-active-administrator'))`)
  const rows = await tx.execute(sql`
    select count(*)::int as count
    from users
    where id <> ${currentUserId}
      and role = 'administrator'
      and status = 'active'
  `)

  if (Number(rows[0]?.count ?? 0) < 1) {
    throw new LastAdministratorError("At least one administrator must stay active")
  }
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

  void request
  return NextResponse.json(
    { error: "CMS menggunakan satu akun administrator. Pembuatan akun dinonaktifkan." },
    { status: 403 },
  )
}

export async function PATCH(request: NextRequest) {
  const guard = await requireApiPermission("user.manage")
  if (guard.response) return guard.response

  const payload = await request.json()
  const id = String(payload.id ?? "")
  const action = String(payload.action ?? "")
  const status = payload.status === "inactive" ? "inactive" : payload.status === "active" ? "active" : null

  if (!id) {
    return NextResponse.json({ error: "Valid id is required" }, { status: 400 })
  }

  const db = getDb()
  const [existing] = await db.select().from(users).where(eq(users.id, id)).limit(1)

  if (!existing) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  if (action === "reset_password") {
    const claimCode = randomBytes(8).toString("hex").toUpperCase()
    let updated: typeof users.$inferSelect

    try {
      updated = await db.transaction(async (tx) => {
        if (existing.role === "administrator") {
          await assertAnotherAdministrator(tx, id)
        }

        const [row] = await tx
          .update(users)
          .set({
            passwordHash: null,
            claimCode,
            status: "unclaimed",
            claimedAt: null,
            updatedAt: new Date(),
          })
          .where(eq(users.id, id))
          .returning()

        return row
      })
    } catch (error) {
      if (error instanceof LastAdministratorError) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }
      throw error
    }

    await writeAuditLog({
      actorId: guard.user?.id,
      action: "user.reset_password",
      entityType: "user",
      entityId: id,
      metadata: { previousStatus: existing.status, newStatus: updated.status },
    })

    return NextResponse.json({ user: serializeUser(updated) })
  }

  if (!status) {
    return NextResponse.json({ error: "Valid id and status are required" }, { status: 400 })
  }

  if (status === "active" && !existing.passwordHash) {
    return NextResponse.json({ error: "Unclaimed users must claim their account before activation" }, { status: 400 })
  }

  let updated: typeof users.$inferSelect

  try {
    updated = await db.transaction(async (tx) => {
      if (existing.role === "administrator" && status === "inactive") {
        await assertAnotherAdministrator(tx, id)
      }

      const [row] = await tx
        .update(users)
        .set({ status, updatedAt: new Date() })
        .where(eq(users.id, id))
        .returning()

      return row
    })
  } catch (error) {
    if (error instanceof LastAdministratorError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    throw error
  }

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

  try {
    await db.transaction(async (tx) => {
      if (existing.role === "administrator") {
        await assertAnotherAdministrator(tx, id)
      }

      await tx.update(users).set({ status: "inactive", updatedAt: new Date() }).where(eq(users.id, id))
    })
  } catch (error) {
    if (error instanceof LastAdministratorError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    throw error
  }
  await writeAuditLog({
    actorId: guard.user?.id,
    action: "user.disable",
    entityType: "user",
    entityId: id,
    metadata: { previousStatus: existing.status, newStatus: "inactive" },
  })

  return NextResponse.json({ ok: true })
}
