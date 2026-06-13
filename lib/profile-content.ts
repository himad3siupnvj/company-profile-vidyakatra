import { eq } from "drizzle-orm"
import { unstable_cache } from "next/cache"
import { getDb } from "@/db"
import { siteSettings } from "@/db/schema"
import { publicCacheTags } from "@/lib/cache-tags"
import {
  defaultProfileContent,
  normalizeProfileContent,
  profileContentKey,
} from "@/lib/profile-content-data"

export const getProfileContent = unstable_cache(
  async function getProfileContent() {
    try {
      const db = getDb()
      const [row] = await db.select().from(siteSettings).where(eq(siteSettings.key, profileContentKey)).limit(1)

      return normalizeProfileContent(row?.value)
    } catch {
      return defaultProfileContent
    }
  },
  ["profile-content"],
  { revalidate: 3600, tags: [publicCacheTags.profile] },
)
