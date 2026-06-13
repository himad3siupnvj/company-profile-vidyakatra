import { NextRequest, NextResponse } from "next/server"
import { getFirestoreDb, firestoreCollections } from "@/db/firestore"
import { fromFirestore } from "@/db/firestore-data"
import type { Division, Member, OrganizationalUnit } from "@/db/models"
import { requireApiPermission } from "@/lib/api-guard"
import { writeAuditLog } from "@/lib/audit"
import { getActivePeriodId } from "@/lib/active-period"
import { revalidateProfileContent } from "@/lib/profile-cache"

export const runtime = "nodejs"

function serializeOrgUnit(
  row: OrganizationalUnit & { memberCount?: number; head?: string },
) {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    description: row.description ?? "",
    imageUrl: row.imageUrl ?? "",
    head: row.head ?? "-",
    memberCount: row.memberCount ?? 0,
    color: row.color ?? "bg-primary",
    sortOrder: row.sortOrder,
  }
}

function serializeDivision(row: Division, unitName?: string | null) {
  return {
    id: row.id,
    name: row.name,
    organizationalUnitId: row.organizationalUnitId,
    organizationalUnit: unitName ?? "Unassigned",
    description: row.description ?? "",
    sortOrder: row.sortOrder,
  }
}

function serializeMember(
  row: Member,
  unitName?: string | null,
  divisionName?: string | null,
) {
  return {
    id: row.id,
    name: row.name,
    position: row.position,
    department: unitName ?? "Unassigned",
    division: divisionName ?? "",
    email: row.email ?? "",
    avatar: row.avatarUrl ?? "",
    status: "active" as const,
    joinDate: (row.joinedAt ?? row.createdAt).toISOString().slice(0, 10),
  }
}

function byOrderAndName(
  left: { sortOrder: number; name: string },
  right: { sortOrder: number; name: string },
) {
  return left.sortOrder - right.sortOrder || left.name.localeCompare(right.name)
}

async function getPeriodRecords<T extends { id: string; periodId: string | null; deletedAt: Date | null }>(
  collectionName: string,
  periodId: string,
) {
  const snapshot = await getFirestoreDb()
    .collection(collectionName)
    .where("periodId", "==", periodId)
    .get()

  return snapshot.docs
    .map((document) => fromFirestore<T>(document))
    .filter((record) => !record.deletedAt)
}

async function resolveRecordId(
  collectionName: string,
  value: unknown,
  periodId: string,
) {
  const raw = String(value ?? "").trim()
  if (!raw) return null

  const collection = getFirestoreDb().collection(collectionName)
  const byId = await collection.doc(raw).get()
  if (byId.exists && !byId.data()?.deletedAt) return byId.id

  const byName = await collection
    .where("periodId", "==", periodId)
    .where("name", "==", raw)
    .limit(1)
    .get()

  return byName.docs[0]?.id ?? null
}

export async function GET() {
  const guard = await requireApiPermission("member.manage")
  if (guard.response) return guard.response

  const activePeriodId = await getActivePeriodId()
  if (!activePeriodId) {
    return NextResponse.json({ organizationalUnits: [], departments: [], divisions: [], members: [] })
  }

  const [units, divisions, members] = await Promise.all([
    getPeriodRecords<OrganizationalUnit>(
      firestoreCollections.organizationalUnits,
      activePeriodId,
    ),
    getPeriodRecords<Division>(firestoreCollections.divisions, activePeriodId),
    getPeriodRecords<Member>(firestoreCollections.members, activePeriodId),
  ])

  units.sort(byOrderAndName)
  divisions.sort(byOrderAndName)
  members.sort(byOrderAndName)

  const unitNames = new Map(units.map((unit) => [unit.id, unit.name]))
  const divisionNames = new Map(divisions.map((division) => [division.id, division.name]))
  const unitSummaries = units.map((unit) => {
    const unitMembers = members.filter(
      (member) => member.organizationalUnitId === unit.id,
    )
    const head = unitMembers.find((member) =>
      /ketua|koordinator|kepala|head/i.test(member.position),
    )?.name

    return serializeOrgUnit({
      ...unit,
      head,
      memberCount: unitMembers.length,
    })
  })

  return NextResponse.json({
    organizationalUnits: unitSummaries,
    departments: unitSummaries,
    divisions: divisions.map((division) =>
      serializeDivision(
        division,
        division.organizationalUnitId
          ? unitNames.get(division.organizationalUnitId)
          : null,
      ),
    ),
    members: members.map((member) =>
      serializeMember(
        member,
        member.organizationalUnitId
          ? unitNames.get(member.organizationalUnitId)
          : null,
        member.divisionId ? divisionNames.get(member.divisionId) : null,
      ),
    ),
  })
}

export async function POST(request: NextRequest) {
  const guard = await requireApiPermission("member.manage")
  if (guard.response) return guard.response

  const payload = await request.json()
  const type = String(payload.type ?? "member")
  const activePeriodId = await getActivePeriodId()
  if (!activePeriodId) {
    return NextResponse.json(
      { error: "No active organization period is configured" },
      { status: 409 },
    )
  }

  const db = getFirestoreDb()
  const now = new Date()

  if (type === "organizational-unit" || type === "department") {
    const name = String(payload.name ?? "").trim()
    if (!name) {
      return NextResponse.json(
        { error: "Organizational unit name is required" },
        { status: 400 },
      )
    }

    const reference = db.collection(firestoreCollections.organizationalUnits).doc()
    const created: OrganizationalUnit = {
      id: reference.id,
      name,
      type: payload.unitType === "bureau" ? "bureau" : "department",
      periodId: activePeriodId,
      description: String(payload.description ?? ""),
      imageUrl: typeof payload.imageUrl === "string" ? payload.imageUrl : null,
      color: String(payload.color ?? "bg-primary"),
      sortOrder: Number(payload.sortOrder ?? 0),
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      deletedBy: null,
    }
    await reference.set({ ...created, id: undefined })
    await writeAuditLog({
      actorId: guard.user?.id,
      action: "org_unit.create",
      entityType: "organizational_unit",
      entityId: reference.id,
      metadata: { type: created.type },
    })
    revalidateProfileContent()

    return NextResponse.json({ organizationalUnit: serializeOrgUnit(created) })
  }

  if (type === "division") {
    const name = String(payload.name ?? "").trim()
    if (!name) {
      return NextResponse.json({ error: "Division name is required" }, { status: 400 })
    }

    const organizationalUnitId = await resolveRecordId(
      firestoreCollections.organizationalUnits,
      payload.organizationalUnitId ?? payload.organizationalUnit,
      activePeriodId,
    )
    const reference = db.collection(firestoreCollections.divisions).doc()
    const created: Division = {
      id: reference.id,
      name,
      organizationalUnitId,
      periodId: activePeriodId,
      description: String(payload.description ?? ""),
      sortOrder: Number(payload.sortOrder ?? 0),
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      deletedBy: null,
    }
    await reference.set({ ...created, id: undefined })
    await writeAuditLog({
      actorId: guard.user?.id,
      action: "division.create",
      entityType: "division",
      entityId: reference.id,
      metadata: { organizationalUnitId },
    })
    revalidateProfileContent()

    return NextResponse.json({ division: serializeDivision(created) })
  }

  if (type !== "member") {
    return NextResponse.json(
      { error: "Unsupported organization payload" },
      { status: 400 },
    )
  }

  const name = String(payload.name ?? "").trim()
  const position = String(payload.position ?? "").trim()
  if (!name || !position) {
    return NextResponse.json(
      { error: "Name and position are required" },
      { status: 400 },
    )
  }

  const organizationalUnitId = await resolveRecordId(
    firestoreCollections.organizationalUnits,
    payload.organizationalUnitId ?? payload.department,
    activePeriodId,
  )
  const divisionId = await resolveRecordId(
    firestoreCollections.divisions,
    payload.divisionId ?? payload.division,
    activePeriodId,
  )
  const reference = db.collection(firestoreCollections.members).doc()
  const created: Member = {
    id: reference.id,
    name,
    position,
    organizationalUnitId,
    divisionId,
    periodId: activePeriodId,
    email: String(payload.email ?? "") || null,
    avatarUrl: typeof payload.avatarUrl === "string" ? payload.avatarUrl : null,
    sortOrder: Number(payload.sortOrder ?? 0),
    joinedAt: now,
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
    deletedBy: null,
  }
  await reference.set({ ...created, id: undefined })
  await writeAuditLog({
    actorId: guard.user?.id,
    action: "member.create",
    entityType: "member",
    entityId: reference.id,
    metadata: { organizationalUnitId, divisionId },
  })
  revalidateProfileContent()

  const unitName = organizationalUnitId
    ? (await db.collection(firestoreCollections.organizationalUnits).doc(organizationalUnitId).get()).data()?.name
    : null
  const divisionName = divisionId
    ? (await db.collection(firestoreCollections.divisions).doc(divisionId).get()).data()?.name
    : null

  return NextResponse.json({
    member: serializeMember(created, unitName, divisionName),
  })
}

export async function PUT(request: NextRequest) {
  const guard = await requireApiPermission("member.manage")
  if (guard.response) return guard.response

  const payload = await request.json()
  const type = String(payload.type ?? "member")
  const id = String(payload.id ?? "").trim()
  const activePeriodId = await getActivePeriodId()
  if (!id) {
    return NextResponse.json({ error: "Valid id is required" }, { status: 400 })
  }
  if (!activePeriodId) {
    return NextResponse.json(
      { error: "No active organization period is configured" },
      { status: 409 },
    )
  }

  const db = getFirestoreDb()
  const now = new Date()

  if (type === "organizational-unit" || type === "department") {
    const name = String(payload.name ?? "").trim()
    if (!name) {
      return NextResponse.json(
        { error: "Organizational unit name is required" },
        { status: 400 },
      )
    }

    const reference = db.collection(firestoreCollections.organizationalUnits).doc(id)
    if (!(await reference.get()).exists) {
      return NextResponse.json(
        { error: "Organizational unit not found" },
        { status: 404 },
      )
    }
    const current = (await reference.get()).data()
    await reference.update({
      name,
      type: payload.unitType === "bureau" ? "bureau" : "department",
      description: String(payload.description ?? ""),
      imageUrl:
        typeof payload.imageUrl === "string"
          ? payload.imageUrl
          : current?.imageUrl ?? null,
      color: String(payload.color ?? "bg-primary"),
      sortOrder: Number(payload.sortOrder ?? 0),
      updatedAt: now,
    })
    const updated = fromFirestore<OrganizationalUnit>(await reference.get())
    await writeAuditLog({
      actorId: guard.user?.id,
      action: "org_unit.update",
      entityType: "organizational_unit",
      entityId: id,
    })
    revalidateProfileContent()

    return NextResponse.json({ organizationalUnit: serializeOrgUnit(updated) })
  }

  if (type === "division") {
    const name = String(payload.name ?? "").trim()
    if (!name) {
      return NextResponse.json({ error: "Division name is required" }, { status: 400 })
    }
    const organizationalUnitId = await resolveRecordId(
      firestoreCollections.organizationalUnits,
      payload.organizationalUnitId ?? payload.organizationalUnit,
      activePeriodId,
    )
    const reference = db.collection(firestoreCollections.divisions).doc(id)
    if (!(await reference.get()).exists) {
      return NextResponse.json({ error: "Division not found" }, { status: 404 })
    }
    await reference.update({
      name,
      organizationalUnitId,
      description: String(payload.description ?? ""),
      sortOrder: Number(payload.sortOrder ?? 0),
      updatedAt: now,
    })
    const updated = fromFirestore<Division>(await reference.get())
    await writeAuditLog({
      actorId: guard.user?.id,
      action: "division.update",
      entityType: "division",
      entityId: id,
    })
    revalidateProfileContent()

    return NextResponse.json({ division: serializeDivision(updated) })
  }

  const name = String(payload.name ?? "").trim()
  const position = String(payload.position ?? "").trim()
  if (!name || !position) {
    return NextResponse.json(
      { error: "Name and position are required" },
      { status: 400 },
    )
  }
  const organizationalUnitId = await resolveRecordId(
    firestoreCollections.organizationalUnits,
    payload.organizationalUnitId ?? payload.department,
    activePeriodId,
  )
  const divisionId = await resolveRecordId(
    firestoreCollections.divisions,
    payload.divisionId ?? payload.division,
    activePeriodId,
  )
  const reference = db.collection(firestoreCollections.members).doc(id)
  if (!(await reference.get()).exists) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 })
  }
  await reference.update({
    name,
    position,
    organizationalUnitId,
    divisionId,
    email: String(payload.email ?? "") || null,
    avatarUrl: payload.avatarUrl || payload.avatar || null,
    updatedAt: now,
  })
  const updated = fromFirestore<Member>(await reference.get())
  await writeAuditLog({
    actorId: guard.user?.id,
    action: "member.update",
    entityType: "member",
    entityId: id,
  })
  revalidateProfileContent()

  const unitName = organizationalUnitId
    ? (await db.collection(firestoreCollections.organizationalUnits).doc(organizationalUnitId).get()).data()?.name
    : null
  const divisionName = divisionId
    ? (await db.collection(firestoreCollections.divisions).doc(divisionId).get()).data()?.name
    : null

  return NextResponse.json({
    member: serializeMember(updated, unitName, divisionName),
  })
}

export async function DELETE(request: NextRequest) {
  const guard = await requireApiPermission("member.manage")
  if (guard.response) return guard.response

  const id = request.nextUrl.searchParams.get("id")
  const type = request.nextUrl.searchParams.get("type") ?? "member"
  if (!id) {
    return NextResponse.json({ error: "Valid id is required" }, { status: 400 })
  }

  const db = getFirestoreDb()
  const now = new Date()

  if (type === "organizational-unit" || type === "department") {
    const [memberSnapshot, divisionSnapshot] = await Promise.all([
      db.collection(firestoreCollections.members)
        .where("organizationalUnitId", "==", id)
        .get(),
      db.collection(firestoreCollections.divisions)
        .where("organizationalUnitId", "==", id)
        .get(),
    ])
    const batch = db.batch()
    memberSnapshot.docs.forEach((document) =>
      batch.update(document.ref, {
        organizationalUnitId: null,
        divisionId: null,
        updatedAt: now,
      }),
    )
    divisionSnapshot.docs.forEach((document) =>
      batch.update(document.ref, { organizationalUnitId: null, updatedAt: now }),
    )
    batch.update(
      db.collection(firestoreCollections.organizationalUnits).doc(id),
      { deletedAt: now, deletedBy: guard.user?.id ?? null, updatedAt: now },
    )
    await batch.commit()
  } else {
    const collectionName =
      type === "division" ? firestoreCollections.divisions : firestoreCollections.members
    await db.collection(collectionName).doc(id).update({
      deletedAt: now,
      deletedBy: guard.user?.id ?? null,
      updatedAt: now,
    })
  }

  await writeAuditLog({
    actorId: guard.user?.id,
    action:
      type === "organizational-unit" || type === "department"
        ? "org_unit.delete"
        : `${type}.delete`,
    entityType: type,
    entityId: id,
  })
  revalidateProfileContent()

  return NextResponse.json({ ok: true })
}
