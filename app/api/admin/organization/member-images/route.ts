import { NextRequest, NextResponse } from "next/server"
import { getFirestoreDb, firestoreCollections } from "@/db/firestore"
import { fromFirestore } from "@/db/firestore-data"
import type { Member } from "@/db/models"
import { requireApiPermission } from "@/lib/api-guard"
import { getActivePeriodId } from "@/lib/active-period"
import { writeAuditLog } from "@/lib/audit"
import { revalidateProfileContent } from "@/lib/profile-cache"
import {
  createStoragePath,
  uploadFileToStorage,
  validateUploadFile,
} from "@/lib/storage"

export const runtime = "nodejs"

function normalizeName(value: string) {
  return value
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/\b(foto|photo|profile|profil|anggota|member)\b/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, "")
}

function findMatchingMember(fileName: string, members: Member[]) {
  const normalizedFile = normalizeName(fileName)
  const matches = members.filter((member) => normalizeName(member.name) === normalizedFile)

  return matches.length === 1 ? matches[0] : null
}

export async function POST(request: NextRequest) {
  const guard = await requireApiPermission("member.manage")
  if (guard.response) return guard.response

  const activePeriodId = await getActivePeriodId()
  if (!activePeriodId) {
    return NextResponse.json(
      { error: "No active organization period is configured" },
      { status: 409 },
    )
  }

  const formData = await request.formData()
  const files = formData
    .getAll("files")
    .filter((value): value is File => value instanceof File && value.size > 0)

  if (!files.length) {
    return NextResponse.json({ error: "Pilih minimal satu foto anggota." }, { status: 400 })
  }

  const db = getFirestoreDb()
  const memberSnapshot = await db
    .collection(firestoreCollections.members)
    .where("periodId", "==", activePeriodId)
    .get()
  const members = memberSnapshot.docs
    .map((document) => fromFirestore<Member>(document))
    .filter((member) => !member.deletedAt)
  const uploaded: Array<{
    fileName: string
    memberId: string
    memberName: string
    url: string
  }> = []
  const unmatched: Array<{ fileName: string; reason: string }> = []

  for (const file of files) {
    const member = findMatchingMember(file.name, members)
    if (!member) {
      unmatched.push({
        fileName: file.name,
        reason: "Nama file belum cocok dengan tepat ke satu anggota.",
      })
      continue
    }

    const validation = await validateUploadFile(file, "organization-image")
    if (!validation.ok) {
      unmatched.push({ fileName: file.name, reason: validation.error })
      continue
    }

    try {
      const path = createStoragePath(file, "organization-image", {
        category: "members",
        kind: member.name,
      })
      const url = await uploadFileToStorage(file, path)
      const now = new Date()

      await Promise.all([
        db.collection(firestoreCollections.members).doc(member.id).update({
          avatarUrl: url,
          updatedAt: now,
        }),
        db.collection(firestoreCollections.assets).add({
          url,
          fileName: file.name,
          mimeType: file.type || "application/octet-stream",
          sizeBytes: file.size,
          uploadedBy: guard.user?.id ?? null,
          purpose: "member-image",
          memberId: member.id,
          createdAt: now,
          deletedAt: null,
          deletedBy: null,
        }),
      ])

      uploaded.push({
        fileName: file.name,
        memberId: member.id,
        memberName: member.name,
        url,
      })
    } catch (error) {
      unmatched.push({
        fileName: file.name,
        reason: error instanceof Error ? error.message : "Upload gagal.",
      })
    }
  }

  await writeAuditLog({
    actorId: guard.user?.id,
    action: "member.images.upload",
    entityType: "member",
    metadata: {
      uploaded: uploaded.map(({ fileName, memberId }) => ({ fileName, memberId })),
      unmatched,
    },
  })

  if (uploaded.length) revalidateProfileContent()

  return NextResponse.json({ uploaded, unmatched })
}
