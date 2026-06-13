import { NextRequest, NextResponse } from "next/server"
import { getFirestoreDb, firestoreCollections } from "@/db/firestore"
import { fromFirestore } from "@/db/firestore-data"
import type { Period, PeriodStatus } from "@/db/models"
import { requireApiPermission } from "@/lib/api-guard"
import { writeAuditLog } from "@/lib/audit"

export const runtime = "nodejs"

function isPeriodStatus(value: unknown): value is PeriodStatus {
  return value === "upcoming" || value === "active" || value === "archived"
}

function serializePeriod(row: Period) {
  return {
    id: row.id,
    name: row.name,
    status: row.status,
    startDate: row.startDate,
    endDate: row.endDate,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }
}

async function archiveOtherActivePeriods(
  transaction: FirebaseFirestore.Transaction,
  currentId: string,
  now: Date,
) {
  const active = await transaction.get(
    getFirestoreDb()
      .collection(firestoreCollections.periods)
      .where("status", "==", "active"),
  )
  for (const document of active.docs) {
    if (document.id !== currentId) {
      transaction.update(document.ref, { status: "archived", updatedAt: now })
    }
  }
}

export async function GET() {
  const guard = await requireApiPermission("period.manage")
  if (guard.response) return guard.response

  const snapshot = await getFirestoreDb().collection(firestoreCollections.periods).get()
  const rows = snapshot.docs
    .map((document) => fromFirestore<Period>(document))
    .sort((left, right) => left.name.localeCompare(right.name))

  return NextResponse.json({ periods: rows.map(serializePeriod) })
}

export async function POST(request: NextRequest) {
  const guard = await requireApiPermission("period.manage")
  if (guard.response) return guard.response

  const payload = await request.json()
  const name = String(payload.name ?? "").trim()
  const status = isPeriodStatus(payload.status) ? payload.status : "upcoming"
  if (!name) {
    return NextResponse.json({ error: "Period name is required" }, { status: 400 })
  }

  const db = getFirestoreDb()
  const reference = db.collection(firestoreCollections.periods).doc()
  const now = new Date()
  const period: Period = {
    id: reference.id,
    name,
    status,
    startDate: payload.startDate || null,
    endDate: payload.endDate || null,
    createdAt: now,
    updatedAt: now,
  }

  await db.runTransaction(async (transaction) => {
    if (status === "active") {
      await archiveOtherActivePeriods(transaction, reference.id, now)
    }
    transaction.set(reference, {
      name: period.name,
      status: period.status,
      startDate: period.startDate,
      endDate: period.endDate,
      createdAt: now,
      updatedAt: now,
    })
  })

  await writeAuditLog({
    actorId: guard.user?.id,
    action: "period.create",
    entityType: "period",
    entityId: reference.id,
    metadata: { status },
  })

  return NextResponse.json({ period: serializePeriod(period) })
}

export async function PUT(request: NextRequest) {
  const guard = await requireApiPermission("period.manage")
  if (guard.response) return guard.response

  const payload = await request.json()
  const id = String(payload.id ?? "")
  const name = String(payload.name ?? "").trim()
  const status = isPeriodStatus(payload.status) ? payload.status : null
  if (!id || !name || !status) {
    return NextResponse.json(
      { error: "Valid id, name, and status are required" },
      { status: 400 },
    )
  }

  const db = getFirestoreDb()
  const reference = db.collection(firestoreCollections.periods).doc(id)
  const updated = await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(reference)
    if (!snapshot.exists) return null

    const now = new Date()
    if (status === "active") {
      await archiveOtherActivePeriods(transaction, id, now)
    }
    transaction.update(reference, {
      name,
      status,
      startDate: payload.startDate || null,
      endDate: payload.endDate || null,
      updatedAt: now,
    })

    return {
      id,
      ...(snapshot.data() as Omit<Period, "id">),
      name,
      status,
      startDate: payload.startDate || null,
      endDate: payload.endDate || null,
      updatedAt: now,
    } as Period
  })

  if (!updated) {
    return NextResponse.json({ error: "Period not found" }, { status: 404 })
  }

  await writeAuditLog({
    actorId: guard.user?.id,
    action: "period.update",
    entityType: "period",
    entityId: id,
    metadata: { status },
  })

  return NextResponse.json({ period: serializePeriod(updated) })
}

export async function DELETE(request: NextRequest) {
  const guard = await requireApiPermission("period.manage")
  if (guard.response) return guard.response

  const id = request.nextUrl.searchParams.get("id")
  if (!id) {
    return NextResponse.json({ error: "Valid id is required" }, { status: 400 })
  }

  const reference = getFirestoreDb().collection(firestoreCollections.periods).doc(id)
  const snapshot = await reference.get()
  if (!snapshot.exists) {
    return NextResponse.json({ error: "Period not found" }, { status: 404 })
  }

  const now = new Date()
  await reference.update({ status: "archived", updatedAt: now })
  const period = {
    id,
    ...snapshot.data(),
    status: "archived",
    updatedAt: now,
  } as Period

  await writeAuditLog({
    actorId: guard.user?.id,
    action: "period.archive",
    entityType: "period",
    entityId: id,
  })

  return NextResponse.json({ period: serializePeriod(period) })
}
