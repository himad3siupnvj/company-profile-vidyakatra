import { eq } from "drizzle-orm"
import { unstable_cache } from "next/cache"
import { getDb } from "@/db"
import { siteSettings } from "@/db/schema"
import { publicCacheTags } from "@/lib/cache-tags"
import { officialSocialUrls, type SocialMediaUrls } from "@/lib/social-links"

export type PublicSocialMedia = SocialMediaUrls

const defaultPublicSettings = {
  socialMedia: officialSocialUrls,
}

function normalizeSocialMedia(value: unknown): PublicSocialMedia {
  if (!value || typeof value !== "object") return officialSocialUrls

  const candidate = value as Partial<Record<keyof PublicSocialMedia, unknown>>

  return {
    instagram: typeof candidate.instagram === "string" && candidate.instagram ? candidate.instagram : officialSocialUrls.instagram,
    youtube: typeof candidate.youtube === "string" && candidate.youtube ? candidate.youtube : officialSocialUrls.youtube,
    linkedin: typeof candidate.linkedin === "string" && candidate.linkedin ? candidate.linkedin : officialSocialUrls.linkedin,
    tiktok: typeof candidate.tiktok === "string" && candidate.tiktok ? candidate.tiktok : officialSocialUrls.tiktok,
  }
}

export const getPublicSiteSettings = unstable_cache(
  async function getPublicSiteSettings() {
    try {
      const db = getDb()
      const [row] = await db
        .select({ value: siteSettings.value })
        .from(siteSettings)
        .where(eq(siteSettings.key, "socialMedia"))
        .limit(1)

      return {
        socialMedia: normalizeSocialMedia(row?.value),
      }
    } catch {
      return defaultPublicSettings
    }
  },
  ["public-site-settings"],
  { revalidate: 300, tags: [publicCacheTags.settings] },
)
