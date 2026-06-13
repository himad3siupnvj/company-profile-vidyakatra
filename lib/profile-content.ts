import { unstable_cache } from "next/cache"
import { getFirestoreDb, firestoreCollections } from "@/db/firestore"
import { publicCacheTags } from "@/lib/cache-tags"
import {
  defaultProfileContent,
  normalizeProfileContent,
  profileContentKey,
} from "@/lib/profile-content-data"

export const getProfileContent = unstable_cache(
  async function getProfileContent() {
    try {
      const snapshot = await getFirestoreDb()
        .collection(firestoreCollections.siteSettings)
        .where("key", "==", profileContentKey)
        .limit(1)
        .get()

      return normalizeProfileContent(snapshot.docs[0]?.data().value)
    } catch {
      return defaultProfileContent
    }
  },
  ["profile-content"],
  { revalidate: 3600, tags: [publicCacheTags.profile] },
)
