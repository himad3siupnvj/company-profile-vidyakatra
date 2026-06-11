import { and, asc, eq, isNull } from "drizzle-orm"
import { getDb } from "@/db"
import { divisions, members, organizationalUnits, periods } from "@/db/schema"

export async function getPublicMembers() {
  const db = getDb()

  return db
    .select({
      id: members.id,
      name: members.name,
      position: members.position,
      organizationalUnitId: members.organizationalUnitId,
      divisionId: members.divisionId,
      avatarUrl: members.avatarUrl,
      sortOrder: members.sortOrder,
    })
    .from(members)
    .innerJoin(periods, eq(members.periodId, periods.id))
    .where(and(isNull(members.deletedAt), eq(periods.status, "active")))
    .orderBy(asc(members.sortOrder), asc(members.name))
}

export async function getPublicOrganizationalUnits() {
  const db = getDb()

  return db
    .select({
      id: organizationalUnits.id,
      name: organizationalUnits.name,
      type: organizationalUnits.type,
      description: organizationalUnits.description,
      color: organizationalUnits.color,
      sortOrder: organizationalUnits.sortOrder,
    })
    .from(organizationalUnits)
    .innerJoin(periods, eq(organizationalUnits.periodId, periods.id))
    .where(and(isNull(organizationalUnits.deletedAt), eq(periods.status, "active")))
    .orderBy(asc(organizationalUnits.sortOrder), asc(organizationalUnits.name))
}

export async function getPublicDivisions() {
  const db = getDb()

  return db
    .select({
      id: divisions.id,
      name: divisions.name,
      organizationalUnitId: divisions.organizationalUnitId,
      description: divisions.description,
      sortOrder: divisions.sortOrder,
    })
    .from(divisions)
    .innerJoin(periods, eq(divisions.periodId, periods.id))
    .where(and(isNull(divisions.deletedAt), eq(periods.status, "active")))
    .orderBy(asc(divisions.sortOrder), asc(divisions.name))
}
