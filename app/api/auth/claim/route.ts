import { NextRequest, NextResponse } from "next/server"
import { getFirestoreDb, firestoreCollections } from "@/db/firestore"
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

    const db = getFirestoreDb()
    const snapshot = await db
      .collection(firestoreCollections.users)
      .where("email", "==", email)
      .limit(1)
      .get()
    const userDocument = snapshot.docs[0]
    const user = userDocument?.data()

    if (!user || user.status !== "unclaimed" || user.claimCode !== claimCode) {
      return NextResponse.json({ error: "Invalid account claim" }, { status: 401 })
    }

    const passwordHash = await hashPassword(password)
    const updated = await db.runTransaction(async (transaction) => {
      const reference = userDocument.ref
      const currentSnapshot = await transaction.get(reference)
      const current = currentSnapshot.data()

      if (
        !currentSnapshot.exists ||
        current?.status !== "unclaimed" ||
        current?.claimCode !== claimCode
      ) {
        return false
      }

      transaction.update(reference, {
        passwordHash,
        claimCode: null,
        status: "active",
        claimedAt: new Date(),
        updatedAt: new Date(),
      })

      return true
    })

    if (!updated) {
      return NextResponse.json({ error: "Invalid account claim" }, { status: 409 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Claim failed", error)

    return NextResponse.json({ error: "Claim service error" }, { status: 500 })
  }
}
