import { eq } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/db"
import { siteSettings } from "@/db/schema"
import { requireApiPermission } from "@/lib/api-guard"
import { writeAuditLog } from "@/lib/audit"
import {
  defaultProfileContent,
  normalizeProfileContent,
  profileContentKey,
} from "@/lib/profile-content-data"
import { revalidateProfileContent } from "@/lib/profile-cache"

export const runtime = "nodejs"

export async function GET() {
  const guard = await requireApiPermission("settings.manage")
  if (guard.response) return guard.response

  const db = getDb()
  const [row] = await db.select().from(siteSettings).where(eq(siteSettings.key, profileContentKey)).limit(1)

  return NextResponse.json({ profileContent: normalizeProfileContent(row?.value ?? defaultProfileContent) })
}

export async function POST(request: NextRequest) {
  const guard = await requireApiPermission("settings.manage")
  if (guard.response) return guard.response

  const payload = await request.json()
  const profileContent = normalizeProfileContent(payload.profileContent ?? payload)
  const db = getDb()
  const now = new Date()

  await db
    .insert(siteSettings)
    .values({
      key: profileContentKey,
      value: profileContent,
      updatedAt: now,
      updatedBy: guard.user?.id,
    })
    .onConflictDoUpdate({
      target: siteSettings.key,
      set: {
        value: profileContent,
        updatedAt: now,
        updatedBy: guard.user?.id,
      },
    })

  await writeAuditLog({
    actorId: guard.user?.id,
    action: "profile.update",
    entityType: "site_settings",
    metadata: { key: profileContentKey },
  })

  revalidateProfileContent()

  return NextResponse.json({ profileContent })
}
