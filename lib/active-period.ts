import { getFirestoreDb, firestoreCollections } from "@/db/firestore"

export async function getActivePeriodId() {
  const snapshot = await getFirestoreDb()
    .collection(firestoreCollections.periods)
    .where("status", "==", "active")
    .limit(1)
    .get()

  return snapshot.docs[0]?.id ?? null
}
