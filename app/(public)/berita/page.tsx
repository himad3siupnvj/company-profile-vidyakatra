"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Calendar, User, ArrowRight, Clock, Zap, Cpu } from "lucide-react"

const categories = [
  { id: "all", label: "Semua" },
  { id: "berita", label: "Berita Acara" },
  { id: "kegiatan", label: "Kegiatan" },
  { id: "pengumuman", label: "Pengumuman" },
  { id: "prestasi", label: "Prestasi" },
]

const newsData = [
  {
    id: 1,
    title: "Workshop UI/UX Design Bersama Praktisi Industri",
    excerpt: "Tingkatkan kemampuan desain interface dengan bimbingan langsung dari profesional industri teknologi. Workshop ini akan membahas prinsip-prinsip dasar hingga advanced dalam merancang pengalaman pengguna.",
    content: "Lorem ipsum dolor sit amet...",
    date: "15 Mei 2026",
    readTime: "5 min",
    author: "Tim Media",
    category: "kegiatan",
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&h=600&fit=crop",
    featured: true,
  },
  {
    id: 2,
    title: "Seminar Nasional Teknologi Informasi 2026",
    excerpt: "Menghadirkan pembicara dari berbagai perusahaan teknologi terkemuka seperti Google, Microsoft, dan startup unicorn Indonesia untuk berbagi insight tentang masa depan teknologi.",
    content: "Lorem ipsum dolor sit amet...",
    date: "10 Mei 2026",
    readTime: "4 min",
    author: "Tim Humas",
    category: "kegiatan",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop",
    featured: true,
  },
  {
    id: 3,
    title: "Kompetisi Hackathon Internal HIMA",
    excerpt: "Ajang adu kreativitas dan kemampuan coding antar mahasiswa D3 SI. Peserta akan berlomba dalam tim untuk menciptakan solusi inovatif dalam waktu 24 jam.",
    content: "Lorem ipsum dolor sit amet...",
    date: "5 Mei 2026",
    readTime: "3 min",
    author: "Divisi Teknologi",
    category: "kegiatan",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=600&fit=crop",
    featured: false,
  },
  {
    id: 4,
    title: "Mahasiswa D3 SI Raih Juara 1 Lomba Web Development",
    excerpt: "Kebanggaan besar bagi HIMA D3 SI! Tim kita berhasil meraih juara pertama dalam kompetisi pengembangan web tingkat nasional yang diikuti oleh lebih dari 100 tim dari seluruh Indonesia.",
    content: "Lorem ipsum dolor sit amet...",
    date: "1 Mei 2026",
    readTime: "4 min",
    author: "Tim Media",
    category: "prestasi",
    image: "https://images.unsplash.com/photo-1496469888073-80de7e952517?w=800&h=600&fit=crop",
    featured: false,
  },
  {
    id: 5,
    title: "Pengumuman: Pendaftaran Anggota Baru HIMA 2026",
    excerpt: "Dibuka pendaftaran anggota baru HIMA D3 SI periode 2026/2027. Kesempatan emas untuk mengembangkan diri dan berkontribusi dalam organisasi.",
    content: "Lorem ipsum dolor sit amet...",
    date: "28 April 2026",
    readTime: "2 min",
    author: "Sekretaris",
    category: "pengumuman",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=600&fit=crop",
    featured: false,
  },
  {
    id: 6,
    title: "Kunjungan Industri ke Perusahaan Teknologi Surabaya",
    excerpt: "HIMA D3 SI mengadakan kunjungan industri ke beberapa perusahaan teknologi ternama di Surabaya untuk memberikan exposure kepada mahasiswa tentang dunia kerja.",
    content: "Lorem ipsum dolor sit amet...",
    date: "20 April 2026",
    readTime: "4 min",
    author: "Divisi Humas",
    category: "kegiatan",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
    featured: false,
  },
  {
    id: 7,
    title: "Kolaborasi dengan HIMA Teknik Informatika",
    excerpt: "Kerjasama strategis antara HIMA D3 SI dan HIMA Teknik Informatika untuk mengadakan event bersama demi pengembangan mahasiswa.",
    content: "Lorem ipsum dolor sit amet...",
    date: "15 April 2026",
    readTime: "3 min",
    author: "Ketua HIMA",
    category: "berita",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop",
    featured: false,
  },
  {
    id: 8,
    title: "Tim HIMA Lolos Seleksi GEMASTIK 2026",
    excerpt: "Kabar gembira! Tim dari HIMA D3 SI berhasil lolos seleksi tahap pertama GEMASTIK 2026 dalam kategori pengembangan perangkat lunak.",
    content: "Lorem ipsum dolor sit amet...",
    date: "10 April 2026",
    readTime: "3 min",
    author: "Tim Media",
    category: "prestasi",
    image: "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=800&h=600&fit=crop",
    featured: false,
  },
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
              <Card key={news.id} className="group overflow-hidden border-border/50 bg-card/80 backdrop-blur transition-all duration-300 hover:border-primary/30 hover:-translate-y-1 hover:glow-primary-sm">
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
                    <Badge className="text-xs capitalize bg-secondary/20 text-secondary hover:bg-secondary/30">
                      {news.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{news.date}</span>
                  </div>
                  <h3 className="mb-2 font-semibold leading-tight line-clamp-2 transition-colors group-hover:text-primary">
                    {news.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
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

      {/* Subscribe Section */}
      <section className="relative overflow-hidden py-16 md:py-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.2)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.2)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[150px]" />
        
        <div className="relative mx-auto max-w-7xl px-4 md:px-6">
          <Card className="overflow-hidden border-primary/20 bg-card/80 backdrop-blur">
            <CardContent className="p-8 md:p-12">
              <div className="mx-auto max-w-2xl text-center">
                <Badge className="mb-4 border-primary/30 bg-primary/10 text-primary">
                  <Cpu className="mr-1.5 h-3 w-3" />
                  Newsletter
                </Badge>
                <h2 className="text-2xl font-bold md:text-3xl">
                  Jangan Lewatkan Informasi Terbaru
                </h2>
                <p className="mt-4 text-muted-foreground">
                  Berlangganan newsletter kami untuk mendapatkan update berita acara dan kegiatan langsung di email Anda
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <Input
                    type="email"
                    placeholder="Masukkan email Anda"
                    className="sm:w-80 bg-muted/50 border-border/50 focus:border-primary/50"
                  />
                  <Button className="bg-gradient-brand text-primary-foreground hover:opacity-90 transition-all duration-300 hover:glow-primary-sm">
                    Berlangganan
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  )
}
