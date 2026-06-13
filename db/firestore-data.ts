import {
  Timestamp,
  type DocumentData,
  type DocumentSnapshot,
  type QueryDocumentSnapshot,
} from "firebase-admin/firestore"

export type FirestoreRecord = DocumentData & { id: string }

export function fromFirestore<T extends FirestoreRecord>(
  snapshot: QueryDocumentSnapshot<DocumentData> | DocumentSnapshot<DocumentData>,
): T {
  const data = convertFirestoreValue(snapshot.data() ?? {}) as DocumentData
  return {
    id: snapshot.id,
    ...data,
  } as T
}

export function convertFirestoreValue(value: unknown): unknown {
  if (value instanceof Timestamp) return value.toDate()
  if (Array.isArray(value)) return value.map(convertFirestoreValue)
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [
        key,
        convertFirestoreValue(nestedValue),
      ]),
    )
  }
  return value
}

export function withoutId<T extends FirestoreRecord>(record: T) {
  const { id: _id, ...data } = record
  return data
}
