import { and, count, eq, isNull } from "drizzle-orm"
import { unstable_cache } from "next/cache"
import { getDb } from "@/db"
import { articles, members, organizationalUnits, periods } from "@/db/schema"
import { publicCacheTags } from "@/lib/cache-tags"

export const getPublicHomeStats = unstable_cache(
  async function getPublicHomeStats() {
    try {
      const db = getDb()
      const [memberRows, unitRows, articleRows, activePeriods] = await Promise.all([
        db
          .select({ value: count() })
          .from(members)
          .innerJoin(periods, eq(members.periodId, periods.id))
          .where(and(eq(periods.status, "active"), isNull(members.deletedAt))),
        db
          .select({ value: count() })
          .from(organizationalUnits)
          .innerJoin(periods, eq(organizationalUnits.periodId, periods.id))
          .where(and(eq(periods.status, "active"), isNull(organizationalUnits.deletedAt))),
        db
          .select({ value: count() })
          .from(articles)
          .innerJoin(periods, eq(articles.periodId, periods.id))
          .where(
            and(
              eq(periods.status, "active"),
              eq(articles.status, "published"),
              isNull(articles.deletedAt),
            ),
          ),
        db
          .select({ name: periods.name })
          .from(periods)
          .where(eq(periods.status, "active"))
          .limit(1),
      ])
      return {
        activeMembers: memberRows[0]?.value ?? 0,
        activeUnits: unitRows[0]?.value ?? 0,
        publishedArticles: articleRows[0]?.value ?? 0,
        activePeriod: activePeriods[0]?.name ?? "-",
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
