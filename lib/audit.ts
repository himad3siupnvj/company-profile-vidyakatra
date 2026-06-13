import { getFirestoreDb, firestoreCollections } from "@/db/firestore"

type AuditInput = {
  actorId?: string | null
  action: string
  entityType?: string | null
  entityId?: string | null
  metadata?: Record<string, unknown> | null
}

export async function writeAuditLog(input: AuditInput) {
  await getFirestoreDb().collection(firestoreCollections.auditLogs).add({
    actorId: input.actorId ?? null,
    action: input.action,
    entityType: input.entityType ?? null,
    entityId: input.entityId ?? null,
    metadata: input.metadata ?? null,
    createdAt: new Date(),
  })
}
