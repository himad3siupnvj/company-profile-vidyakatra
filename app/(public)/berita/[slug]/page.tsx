import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Calendar, Clock, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArticleDocumentRenderer } from "@/components/public/article-document-renderer"
import type { ArticleDocument } from "@/lib/article-content"
import { getPublicNewsBySlug } from "@/lib/public-articles"
import { newsData } from "@/lib/public-content"

type NewsDetailPageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return newsData.map((news) => ({ slug: news.slug }))
}

export const dynamic = "force-dynamic"

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params
  const news = await getPublicNewsBySlug(slug)

  if (!news) {
    notFound()
  }

  const document: ArticleDocument =
    news.document ?? {
      type: "doc",
      content: news.content.map((paragraph, index) => ({
        id: `${news.slug}-${index}`,
        type: "paragraph",
        text: paragraph,
      })),
    }

  return (
    <article>
      <section className="relative overflow-hidden border-b border-border/50 py-12 md:py-16">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.22)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.22)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute left-1/4 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />

        <div className="relative mx-auto max-w-5xl px-4 md:px-6">
          <div className="mb-10 flex flex-wrap items-center gap-3">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="-ml-2 h-9 gap-2 px-2 text-muted-foreground hover:bg-primary/10 hover:text-primary"
            >
              <Link href="/berita">
                <ArrowLeft className="h-4 w-4" />
                Kembali ke Berita
              </Link>
            </Button>
            <span className="hidden h-4 w-px bg-border/70 sm:block" />
            <Badge className="bg-primary/10 px-3 py-1 text-sm text-primary capitalize">
              {news.category}
            </Badge>
          </div>

          <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-balance md:text-5xl">
            {news.title}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            {news.excerpt}
          </p>

          <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              {news.date}
            </span>
            <span className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              {news.author}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              {news.readTime}
            </span>
          </div>
        </div>
      </section>

      <section className="py-10 md:py-14">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/60 shadow-[0_24px_80px_rgba(0,0,0,0.24)]">
            <Image
              src={news.image}
              alt={news.title}
              width={1200}
              height={760}
              className="aspect-[16/9] w-full object-cover"
              priority
            />
          </div>

          <div className="mx-auto mt-10 max-w-3xl text-base leading-8 text-muted-foreground">
            <ArticleDocumentRenderer document={document} />
          </div>
        </div>
      </section>
    </article>
  )
}
