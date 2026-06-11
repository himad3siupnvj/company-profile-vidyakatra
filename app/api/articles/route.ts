import { NextRequest, NextResponse } from "next/server"
import { getPublicNews } from "@/lib/public-articles"
import { publicApiHeaders } from "@/lib/public-api"

export async function GET(request: NextRequest) {
  const page = Math.max(1, Number.parseInt(request.nextUrl.searchParams.get("page") ?? "1", 10) || 1)
  const limit = Math.min(
    50,
    Math.max(1, Number.parseInt(request.nextUrl.searchParams.get("limit") ?? "12", 10) || 12),
  )
  const articles = await getPublicNews()
  const start = (page - 1) * limit

  return NextResponse.json(
    {
      articles: articles.slice(start, start + limit),
      pagination: {
        page,
        pageSize: limit,
        total: articles.length,
        hasMore: start + limit < articles.length,
      },
    },
    { headers: publicApiHeaders },
  )
}
