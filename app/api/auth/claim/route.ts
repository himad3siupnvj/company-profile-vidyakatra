import { eq } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/db"
import { users } from "@/db/schema"
import { hashPassword } from "@/lib/auth"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  const payload = await request.json()
  const email = String(payload.email ?? "").trim().toLowerCase()
  const claimCode = String(payload.claimCode ?? "").trim().toUpperCase()
  const password = String(payload.password ?? "")

  if (!email || !claimCode || !password) {
    return NextResponse.json({ error: "Email, claim code, and password are required" }, { status: 400 })
  }

  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
  }

  const db = getDb()
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1)

  if (!user || user.status !== "unclaimed" || user.claimCode !== claimCode) {
    return NextResponse.json({ error: "Invalid claim code" }, { status: 401 })
  }

  await db
    .update(users)
    .set({
      passwordHash: await hashPassword(password),
      claimCode: null,
      status: "active",
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id))

  return NextResponse.json({ ok: true })
}
