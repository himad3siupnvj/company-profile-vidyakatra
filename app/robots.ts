import type { MetadataRoute } from "next"
import { getSiteUrl } from "./site-url"

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl()

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/x-panel", "/x-panel/", "/x-panel/*", "/admin", "/admin/", "/admin/*", "/api", "/api/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
