import type { MetadataRoute } from "next"
import { getSiteUrl } from "./site-url"

const publicRoutes = [
  { path: "/", priority: 1 },
  { path: "/profil", priority: 0.8 },
  { path: "/berita", priority: 0.7 },
  { path: "/kontak", priority: 0.6 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl()
  const lastModified = new Date()

  return publicRoutes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified,
    changeFrequency: "weekly",
    priority: route.priority,
  }))
}
