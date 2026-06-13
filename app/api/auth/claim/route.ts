import { and, eq } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/db"
import { users } from "@/db/schema"
import { hashPassword } from "@/lib/auth"
import { enforceRateLimit, isSameOriginRequest } from "@/lib/request-guard"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    if (!isSameOriginRequest(request)) {
      return NextResponse.json({ error: "Invalid request origin" }, { status: 403 })
    }

    const payload = await request.json()
    const email = String(payload.email ?? "").trim().toLowerCase()
    const claimCode = String(payload.claimCode ?? "").trim().toUpperCase()
    const password = String(payload.password ?? "")
    const rateLimitResponse = await enforceRateLimit(
      request,
      `auth-claim:${email || "unknown"}`,
      5,
      15 * 60_000,
    )

    if (rateLimitResponse) return rateLimitResponse

    if (!email || !claimCode || !password) {
      return NextResponse.json({ error: "Email, claim code, and password are required" }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
    }

    const db = getDb()
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1)

    if (!user || user.status !== "unclaimed" || user.claimCode !== claimCode) {
      return NextResponse.json({ error: "Invalid account claim" }, { status: 401 })
    }

    const [updated] = await db
      .update(users)
      .set({
        passwordHash: await hashPassword(password),
        claimCode: null,
        status: "active",
        claimedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(users.id, user.id),
          eq(users.status, "unclaimed"),
          eq(users.claimCode, claimCode),
        ),
      )
      .returning({ id: users.id })

    if (!updated) {
      return NextResponse.json({ error: "Invalid account claim" }, { status: 409 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Claim failed", error)

    return NextResponse.json({ error: "Claim service error" }, { status: 500 })
  }
}
