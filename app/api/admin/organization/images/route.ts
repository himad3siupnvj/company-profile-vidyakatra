import { and, eq, isNull } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/db"
import { assets, organizationalUnits } from "@/db/schema"
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
  const aliases: Record<string, string[]> = {
    "media dan komunikasi": ["medkom"],
    "pengembangan sumber daya mahasiswa": ["psdm"],
    "ekonomi kreatif": ["ekraf"],
    "sosial politik": ["sospol"],
    "hubungan mahasiswa": ["humsiwa"],
  }

  return aliases[normalizeName(value)] ?? []
}

function findMatchingUnit(
  fileName: string,
  units: Array<typeof organizationalUnits.$inferSelect>,
) {
  const normalizedFile = normalizeName(fileName)
  const compactFile = normalizedFile.replace(/\s+/g, "")
  const matches = units.filter((unit) => {
    const compactUnit = normalizeName(unit.name).replace(/\s+/g, "")

    return (
      compactFile === compactUnit ||
      compactFile === getAcronym(unit.name) ||
      getUnitAliases(unit.name).includes(compactFile) ||
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

  const db = getDb()
  const units = await db
    .select()
    .from(organizationalUnits)
    .where(
      and(
        eq(organizationalUnits.periodId, activePeriodId),
        isNull(organizationalUnits.deletedAt),
      ),
    )
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

      await db.transaction(async (tx) => {
        await tx
          .update(organizationalUnits)
          .set({ imageUrl: url, updatedAt: now })
          .where(eq(organizationalUnits.id, unit.id))
        await tx.insert(assets).values({
          url,
          fileName: file.name,
          mimeType: file.type || "application/octet-stream",
          sizeBytes: file.size,
          uploadedBy: guard.user?.id ?? null,
          createdAt: now,
        })
      })

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
