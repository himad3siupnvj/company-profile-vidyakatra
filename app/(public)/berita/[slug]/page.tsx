import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Calendar, Clock, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { newsData } from "@/lib/public-content"

type NewsDetailPageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return newsData.map((news) => ({ slug: news.slug }))
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params
  const news = newsData.find((item) => item.slug === slug)

  if (!news) {
    notFound()
  }

  return (
    <article>
      <section className="relative overflow-hidden border-b border-border/50 py-12 md:py-16">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.22)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.22)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute left-1/4 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />

        <div className="relative mx-auto max-w-5xl px-4 md:px-6">
          <Button asChild variant="ghost" className="mb-8 gap-2 pl-0 text-muted-foreground hover:text-primary">
            <Link href="/berita">
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Berita
            </Link>
          </Button>

          <Badge className="mb-4 bg-primary/10 text-primary capitalize">
            {news.category}
          </Badge>
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

          <div className="mx-auto mt-10 max-w-3xl space-y-6 text-base leading-8 text-muted-foreground">
            {news.content.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>
    </article>
  )
}
