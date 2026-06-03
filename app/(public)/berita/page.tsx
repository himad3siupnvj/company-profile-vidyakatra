import { NewsList } from "@/components/public/news-list"
import { getPublicNews } from "@/lib/public-articles"

export const revalidate = 300

export default async function BeritaPage() {
  const newsItems = await getPublicNews()

  return <NewsList newsItems={newsItems} />
}
