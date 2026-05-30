import { eq } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/db"
import { users } from "@/db/schema"
import { hashPassword } from "@/lib/auth"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
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

    if (!user) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 })
    }

    if (user.status === "active") {
      return NextResponse.json({ error: "Account is already claimed" }, { status: 409 })
    }

    if (user.status === "inactive") {
      return NextResponse.json({ error: "Account is inactive" }, { status: 403 })
    }

    if (user.claimCode !== claimCode) {
      return NextResponse.json({ error: "Invalid claim code" }, { status: 401 })
    }

    await db
      .update(users)
      .set({
        passwordHash: await hashPassword(password),
        claimCode: null,
        status: "active",
        claimedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id))

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Claim failed", error)

    return NextResponse.json({ error: "Claim service error" }, { status: 500 })
  }
}
