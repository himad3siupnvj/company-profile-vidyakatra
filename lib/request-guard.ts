import { sql } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/db"

let rateLimitTableReady: Promise<void> | null = null

function ensureRateLimitTable() {
  if (!rateLimitTableReady) {
    const db = getDb()

    rateLimitTableReady = db
      .execute(sql`
        create table if not exists request_rate_limits (
          bucket_key text primary key,
          count integer not null default 0,
          reset_at timestamp with time zone not null,
          updated_at timestamp with time zone not null default now()
        )
      `)
      .then(() =>
        Promise.all([
          db.execute(sql`
            create index if not exists articles_public_feed_idx
            on articles (status, deleted_at, published_at)
          `),
          db.execute(sql`
            create index if not exists articles_author_idx
            on articles (author_id, deleted_at, updated_at)
          `),
        ]),
      )
      .then(() => undefined)
      .catch((error) => {
        rateLimitTableReady = null
        throw error
      })
  }

  return rateLimitTableReady
}

function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()

  return forwardedFor || request.headers.get("x-real-ip") || "unknown"
}

export async function enforceRateLimit(request: NextRequest, key: string, limit: number, windowMs: number) {
  await ensureRateLimitTable()

  const now = Date.now()
  const bucketKey = `${key}:${getClientIp(request)}`
  const nextResetAt = new Date(now + windowMs).toISOString()
  const rows = await getDb().execute(sql`
    with cleanup as (
      delete from request_rate_limits
      where reset_at < now() - interval '1 day'
    ),
    updated_bucket as (
      insert into request_rate_limits (bucket_key, count, reset_at, updated_at)
      values (${bucketKey}, 1, ${nextResetAt}::timestamptz, now())
      on conflict (bucket_key) do update set
        count = case
          when request_rate_limits.reset_at <= now() then 1
          else request_rate_limits.count + 1
        end,
        reset_at = case
          when request_rate_limits.reset_at <= now() then ${nextResetAt}::timestamptz
          else request_rate_limits.reset_at
        end,
        updated_at = now()
      returning count, reset_at as "resetAt"
    )
    select count, "resetAt" from updated_bucket
  `)
  const current = rows[0] as { count: number; resetAt: Date | string } | undefined

  if (current && Number(current.count) > limit) {
    const resetAt = new Date(current.resetAt).getTime()

    return NextResponse.json(
      { error: "Too many requests" },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.max(1, Math.ceil((resetAt - now) / 1000))),
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
