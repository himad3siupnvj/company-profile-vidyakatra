import { NextRequest, NextResponse } from "next/server"

type RateLimitEntry = {
  count: number
  resetAt: number
}

const rateLimitBuckets = new Map<string, RateLimitEntry>()

function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()

  return forwardedFor || request.headers.get("x-real-ip") || "unknown"
}

export function enforceRateLimit(request: NextRequest, key: string, limit: number, windowMs: number) {
  const now = Date.now()
  const bucketKey = `${key}:${getClientIp(request)}`
  const current = rateLimitBuckets.get(bucketKey)

  if (!current || current.resetAt <= now) {
    rateLimitBuckets.set(bucketKey, { count: 1, resetAt: now + windowMs })
    return null
  }

  if (current.count >= limit) {
    return NextResponse.json(
      { error: "Too many requests" },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((current.resetAt - now) / 1000)),
        },
      },
    )
  }

  current.count += 1
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
