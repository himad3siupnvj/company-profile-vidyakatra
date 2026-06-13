import { NextRequest, NextResponse } from "next/server"
import { getFirestoreDb, firestoreCollections } from "@/db/firestore"
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

  const snapshot = await getFirestoreDb()
    .collection(firestoreCollections.siteSettings)
    .where("key", "==", profileContentKey)
    .limit(1)
    .get()

  return NextResponse.json({
    profileContent: normalizeProfileContent(
      snapshot.docs[0]?.data().value ?? defaultProfileContent,
    ),
  })
}

export async function POST(request: NextRequest) {
  const guard = await requireApiPermission("settings.manage")
  if (guard.response) return guard.response

  const payload = await request.json()
  const profileContent = normalizeProfileContent(payload.profileContent ?? payload)
  const db = getFirestoreDb()
  const now = new Date()
  const existing = await db
    .collection(firestoreCollections.siteSettings)
    .where("key", "==", profileContentKey)
    .limit(1)
    .get()
  const reference =
    existing.docs[0]?.ref ?? db.collection(firestoreCollections.siteSettings).doc()
  await reference.set(
    {
      key: profileContentKey,
      value: profileContent,
      updatedAt: now,
      updatedBy: guard.user?.id ?? null,
    },
    { merge: true },
  )

  await writeAuditLog({
    actorId: guard.user?.id,
    action: "cabinets.update",
    entityType: "site_settings",
    metadata: { key: profileContentKey },
  })

  revalidateProfileContent()

  return NextResponse.json({ profileContent })
}
