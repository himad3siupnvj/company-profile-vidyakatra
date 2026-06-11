import { NextResponse } from "next/server"
import { getPublicNews } from "@/lib/public-articles"
import { publicApiHeaders } from "@/lib/public-api"

export async function GET() {
  const articles = await getPublicNews()

  return NextResponse.json(
    { articles: articles.filter((article) => article.featured) },
    { headers: publicApiHeaders },
  )
}
