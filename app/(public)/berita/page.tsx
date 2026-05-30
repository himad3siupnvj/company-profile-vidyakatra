import { NewsList } from "@/components/public/news-list"
import { getPublicNews } from "@/lib/public-articles"

export const dynamic = "force-dynamic"

export default async function BeritaPage() {
  const newsItems = await getPublicNews()

  return <NewsList newsItems={newsItems} />
}
