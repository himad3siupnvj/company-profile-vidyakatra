import { getFirestoreDb, firestoreCollections } from "@/db/firestore"
import { fromFirestore } from "@/db/firestore-data"
import type { Division, Member, OrganizationalUnit } from "@/db/models"
import { getActivePeriodId } from "@/lib/active-period"

function byOrderAndName(
  left: { sortOrder: number; name: string },
  right: { sortOrder: number; name: string },
) {
  return left.sortOrder - right.sortOrder || left.name.localeCompare(right.name)
}

export async function getPublicMembers() {
  const periodId = await getActivePeriodId()
  if (!periodId) return []

  const snapshot = await getFirestoreDb()
    .collection(firestoreCollections.members)
    .where("periodId", "==", periodId)
    .get()

  return snapshot.docs
    .map((document) => fromFirestore<Member>(document))
    .filter((member) => !member.deletedAt)
    .sort(byOrderAndName)
    .map(({ id, name, position, organizationalUnitId, divisionId, avatarUrl, sortOrder }) => ({
      id,
      name,
      position,
      organizationalUnitId,
      divisionId,
      avatarUrl,
      sortOrder,
    }))
}

export async function getPublicOrganizationalUnits() {
  const periodId = await getActivePeriodId()
  if (!periodId) return []

  const snapshot = await getFirestoreDb()
    .collection(firestoreCollections.organizationalUnits)
    .where("periodId", "==", periodId)
    .get()

  return snapshot.docs
    .map((document) => fromFirestore<OrganizationalUnit>(document))
    .filter((unit) => !unit.deletedAt)
    .sort(byOrderAndName)
    .map(({ id, name, type, description, imageUrl, color, sortOrder }) => ({
      id,
      name,
      type,
      description,
      imageUrl,
      color,
      sortOrder,
    }))
}

export async function getPublicDivisions() {
  const periodId = await getActivePeriodId()
  if (!periodId) return []

  const snapshot = await getFirestoreDb()
    .collection(firestoreCollections.divisions)
    .where("periodId", "==", periodId)
    .get()

  return snapshot.docs
    .map((document) => fromFirestore<Division>(document))
    .filter((division) => !division.deletedAt)
    .sort(byOrderAndName)
    .map(({ id, name, organizationalUnitId, description, sortOrder }) => ({
      id,
      name,
      organizationalUnitId,
      description,
      sortOrder,
    }))
}
