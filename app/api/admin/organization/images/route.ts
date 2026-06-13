import { NextRequest, NextResponse } from "next/server"
import { getFirestoreDb, firestoreCollections } from "@/db/firestore"
import { fromFirestore } from "@/db/firestore-data"
import type { OrganizationalUnit } from "@/db/models"
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
    .replace(/\b(departemen|department|dept|biro|bureau|logo|gambar|foto|image)\b/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
}

function getAcronym(value: string) {
  const ignored = new Set(["dan", "of", "and"])
  return normalizeName(value)
    .split(" ")
    .filter((part) => part && !ignored.has(part))
    .map((part) => part[0])
    .join("")
}

function getUnitAliases(value: string) {
  const normalized = normalizeName(value)
  const knownAliases: Record<string, string[]> = {
    "media dan komunikasi": ["medkom"],
    "pengembangan sumber daya mahasiswa": ["psdm"],
    "ekonomi kreatif": ["ekraf"],
    "sosial politik": ["sospol"],
    "hubungan mahasiswa": ["humsiwa"],
  }

  return knownAliases[normalized] ?? []
}

function findMatchingUnit(fileName: string, units: OrganizationalUnit[]) {
  const normalizedFile = normalizeName(fileName)
  const compactFile = normalizedFile.replace(/\s+/g, "")

  const matches = units.filter((unit) => {
    const normalizedUnit = normalizeName(unit.name)
    const compactUnit = normalizedUnit.replace(/\s+/g, "")
    const acronym = getAcronym(unit.name)
    const aliases = getUnitAliases(unit.name)

    return (
      compactFile === compactUnit ||
      compactFile === acronym ||
      aliases.includes(compactFile) ||
      compactFile.includes(compactUnit) ||
      compactUnit.includes(compactFile)
    )
  })

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
    return NextResponse.json({ error: "Pilih minimal satu file gambar." }, { status: 400 })
  }

  const db = getFirestoreDb()
  const unitSnapshot = await db
    .collection(firestoreCollections.organizationalUnits)
    .where("periodId", "==", activePeriodId)
    .get()
  const units = unitSnapshot.docs
    .map((document) => fromFirestore<OrganizationalUnit>(document))
    .filter((unit) => !unit.deletedAt)

  const uploaded: Array<{ fileName: string; unitId: string; unitName: string; url: string }> = []
  const unmatched: Array<{ fileName: string; reason: string }> = []

  for (const file of files) {
    const unit = findMatchingUnit(file.name, units)
    if (!unit) {
      unmatched.push({
        fileName: file.name,
        reason: "Nama file belum cocok dengan tepat ke satu unit.",
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
        category: unit.type === "bureau" ? "bureaus" : "departments",
        kind: unit.name,
      })
      const url = await uploadFileToStorage(file, path)
      const now = new Date()

      await Promise.all([
        db.collection(firestoreCollections.organizationalUnits).doc(unit.id).update({
          imageUrl: url,
          updatedAt: now,
        }),
        db.collection(firestoreCollections.assets).add({
          url,
          fileName: file.name,
          mimeType: file.type || "application/octet-stream",
          sizeBytes: file.size,
          uploadedBy: guard.user?.id ?? null,
          purpose: "organization-image",
          organizationalUnitId: unit.id,
          createdAt: now,
          deletedAt: null,
          deletedBy: null,
        }),
      ])

      uploaded.push({ fileName: file.name, unitId: unit.id, unitName: unit.name, url })
    } catch (error) {
      unmatched.push({
        fileName: file.name,
        reason: error instanceof Error ? error.message : "Upload gagal.",
      })
    }
  }

  await writeAuditLog({
    actorId: guard.user?.id,
    action: "org_unit.images.upload",
    entityType: "organizational_unit",
    metadata: {
      uploaded: uploaded.map(({ fileName, unitId }) => ({ fileName, unitId })),
      unmatched,
    },
  })

  if (uploaded.length) revalidateProfileContent()

  return NextResponse.json({ uploaded, unmatched })
}
