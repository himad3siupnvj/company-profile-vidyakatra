import { unstable_cache } from "next/cache"
import { getFirestoreDb, firestoreCollections } from "@/db/firestore"
import { getActivePeriodId } from "@/lib/active-period"
import { publicCacheTags } from "@/lib/cache-tags"

export const getPublicHomeStats = unstable_cache(
  async function getPublicHomeStats() {
    try {
      const db = getFirestoreDb()
      const periodId = await getActivePeriodId()
      if (!periodId) {
        return {
          activeMembers: 0,
          activeUnits: 0,
          publishedArticles: 0,
          activePeriod: "-",
        }
      }

      const period = await db
        .collection(firestoreCollections.periods)
        .doc(periodId)
        .get()
      const [members, units, articles] = await Promise.all([
        db.collection(firestoreCollections.members).where("periodId", "==", periodId).get(),
        db
          .collection(firestoreCollections.organizationalUnits)
          .where("periodId", "==", periodId)
          .get(),
        db.collection(firestoreCollections.articles).where("periodId", "==", periodId).get(),
      ])

      return {
        activeMembers: members.docs.filter((document) => !document.data().deletedAt).length,
        activeUnits: units.docs.filter((document) => !document.data().deletedAt).length,
        publishedArticles: articles.docs.filter((document) => {
          const article = document.data()
          return article.status === "published" && !article.deletedAt
        }).length,
        activePeriod: String(period.data()?.name ?? "-"),
      }
    } catch {
      return {
        activeMembers: 0,
        activeUnits: 0,
        publishedArticles: 0,
        activePeriod: "-",
      }
    }
  },
  ["public-home-stats"],
  { revalidate: 300, tags: [publicCacheTags.articles, publicCacheTags.profile] },
)
