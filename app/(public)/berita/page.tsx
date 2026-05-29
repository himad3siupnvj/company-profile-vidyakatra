"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Calendar, User, ArrowRight, Clock, Zap, Cpu } from "lucide-react"
import { newsData } from "@/lib/public-content"

const categories = [
  { id: "all", label: "Semua" },
  { id: "berita", label: "Berita Acara" },
  { id: "kegiatan", label: "Kegiatan" },
  { id: "pengumuman", label: "Pengumuman" },
  { id: "prestasi", label: "Prestasi" },
]

export default function BeritaPage() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredNews = newsData.filter((news) => {
    const matchesCategory = activeCategory === "all" || news.category === activeCategory
    const matchesSearch = news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      news.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const featuredNews = newsData.filter((news) => news.featured)

  return (
    <>
      {/* Hero Section */}
      <section className="relative flex min-h-[calc(100svh-4rem)] items-center overflow-hidden py-16 md:py-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute left-1/4 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute right-1/4 bottom-0 h-64 w-64 rounded-full bg-secondary/10 blur-[100px]" />
        
        <div className="relative mx-auto max-w-7xl px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4 border-primary/30 bg-primary/10 text-primary">
              <Zap className="mr-1.5 h-3 w-3" />
              Berita Acara & Kegiatan
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl text-balance">
              Berita Acara <span className="text-gradient">HIMA D3 SI</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Ikuti dokumentasi kegiatan, prestasi, dan pengumuman terbaru dari kami
            </p>
          </div>
        </div>
      </section>

      {/* Featured News */}
      

      {/* All News */}
      <section className="border-y border-border/50 bg-card/30 py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          {/* Filters */}
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full md:w-auto">
              <TabsList className="h-auto flex-wrap bg-muted/50 border border-border/50">
                {categories.map((category) => (
                  <TabsTrigger key={category.id} value={category.id} className="px-4 py-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                    {category.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari berita acara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-muted/50 border-border/50 focus:border-primary/50"
              />
            </div>
          </div>

          {/* News Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredNews.map((news) => (
              <Link key={news.id} href={`/berita/${news.slug}`} className="group">
                <Card className="h-full overflow-hidden border-border/50 bg-card/80 backdrop-blur transition-all duration-300 group-hover:-translate-y-1 group-hover:border-primary/30 group-hover:glow-primary-sm">
                  <div className="aspect-[16/10] overflow-hidden">
                    <Image
                      src={news.image}
                      alt={news.title}
                      width={400}
                      height={250}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <Badge className="bg-secondary/20 text-xs capitalize text-secondary hover:bg-secondary/30">
                        {news.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{news.date}</span>
                    </div>
                    <h3 className="mb-2 line-clamp-2 font-semibold leading-tight transition-colors group-hover:text-primary">
                      {news.title}
                    </h3>
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {news.excerpt}
                    </p>
                    <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {news.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {news.readTime}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {filteredNews.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-muted-foreground">Tidak ada berita acara yang ditemukan</p>
            </div>
          )}

          {/* Load More */}
          {filteredNews.length > 0 && (
            <div className="mt-12 text-center">
              <Button variant="outline" size="lg" className="border-border hover:border-primary/50 hover:bg-primary/10 hover:text-primary transition-all duration-300">
                Muat Lebih Banyak
              </Button>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
