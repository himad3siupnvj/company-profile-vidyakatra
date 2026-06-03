import { revalidateTag } from "next/cache"
import { publicCacheTags } from "@/lib/cache-tags"

export function revalidatePublicArticles() {
  try {
    revalidateTag(publicCacheTags.articles, "max")
  } catch (error) {
    if (process.env.NODE_ENV !== "test") {
      console.warn("Public article cache revalidation skipped", error)
    }
  }
}
