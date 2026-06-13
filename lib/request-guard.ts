import { NextRequest, NextResponse } from "next/server"
import { getFirestoreDb, firestoreCollections } from "@/db/firestore"

function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()

  return forwardedFor || request.headers.get("x-real-ip") || "unknown"
}

export async function enforceRateLimit(
  request: NextRequest,
  key: string,
  limit: number,
  windowMs: number,
) {
  const now = Date.now()
  const bucketKey = `${key}:${getClientIp(request)}`
  const reference = getFirestoreDb()
    .collection(firestoreCollections.requestRateLimits)
    .doc(bucketKey)

  const result = await getFirestoreDb().runTransaction(async (transaction) => {
    const snapshot = await transaction.get(reference)
    const current = snapshot.data()
    const currentResetAt =
      current?.resetAt?.toDate?.().getTime?.() ??
      (current?.resetAt instanceof Date ? current.resetAt.getTime() : 0)
    const expired = !snapshot.exists || currentResetAt <= now
    const count = expired ? 1 : Number(current?.count ?? 0) + 1
    const resetAt = expired ? new Date(now + windowMs) : new Date(currentResetAt)

    transaction.set(
      reference,
      {
        bucketKey,
        count,
        resetAt,
        updatedAt: new Date(),
      },
      { merge: true },
    )

    return { count, resetAt }
  })

  if (result.count > limit) {
    return NextResponse.json(
      { error: "Too many requests" },
      {
        status: 429,
        headers: {
          "Retry-After": String(
            Math.max(1, Math.ceil((result.resetAt.getTime() - now) / 1000)),
          ),
        },
      },
    )
  }

  return null
}

export function isSameOriginRequest(request: NextRequest) {
  const origin = request.headers.get("origin")

  if (!origin) return true

  try {
    const originUrl = new URL(origin)
    const appUrl = process.env.APP_URL ? new URL(process.env.APP_URL) : null
    const allowedHosts = new Set(
      [
        request.nextUrl.host,
        request.headers.get("host"),
        request.headers.get("x-forwarded-host"),
        appUrl?.host,
      ].filter(Boolean),
    )

    return allowedHosts.has(originUrl.host)
  } catch {
    return false
  }
}
