import { NextResponse } from "next/server"
import { getPublicNewsBySlug } from "@/lib/public-articles"
import { publicApiHeaders } from "@/lib/public-api"

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params
  const article = await getPublicNewsBySlug(slug)

  if (!article) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 })
  }

  return NextResponse.json({ article }, { headers: publicApiHeaders })
}
