"use client"

import { useState } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { X, ChevronLeft, ChevronRight, Calendar, MapPin, Camera, Zap, Play } from "lucide-react"

const albums = [
  { id: "all", label: "Semua" },
  { id: "seminar", label: "Seminar" },
  { id: "workshop", label: "Workshop" },
  { id: "kompetisi", label: "Kompetisi" },
  { id: "kebersamaan", label: "Kebersamaan" },
]

const galleryData = [
  {
    id: 1,
    title: "Seminar Nasional IT 2026",
    album: "seminar",
    date: "10 Mei 2026",
    location: "Aula Fakultas Vokasi",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=800&fit=crop",
  },
  {
    id: 2,
    title: "Workshop UI/UX Design",
    album: "workshop",
    date: "15 Mei 2026",
    location: "Lab Komputer",
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1200&h=800&fit=crop",
  },
  {
    id: 3,
    title: "Hackathon Internal HIMA",
    album: "kompetisi",
    date: "5 Mei 2026",
    location: "Gedung Pusat",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&h=800&fit=crop",
  },
  {
    id: 4,
    title: "Gathering Anggota 2026",
    album: "kebersamaan",
    date: "20 April 2026",
    location: "Outdoor Campus",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&h=800&fit=crop",
  },
  {
    id: 5,
    title: "Pelatihan Web Development",
    album: "workshop",
    date: "1 April 2026",
    location: "Lab Komputer 2",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=800&fit=crop",
  },
  {
    id: 6,
    title: "Lomba Web Development",
    album: "kompetisi",
    date: "25 Maret 2026",
    location: "Jakarta",
    image: "https://images.unsplash.com/photo-1496469888073-80de7e952517?w=1200&h=800&fit=crop",
  },
  {
    id: 7,
    title: "Seminar Karir IT",
    album: "seminar",
    date: "15 Maret 2026",
    location: "Aula Utama",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1200&h=800&fit=crop",
  },
  {
    id: 8,
    title: "Team Building Activity",
    album: "kebersamaan",
    date: "10 Maret 2026",
    location: "Trawas",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&h=800&fit=crop",
  },
  {
    id: 9,
    title: "Workshop Mobile Development",
    album: "workshop",
    date: "1 Maret 2026",
    location: "Lab Mobile",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&h=800&fit=crop",
  },
  {
    id: 10,
    title: "GEMASTIK 2025",
    album: "kompetisi",
    date: "20 November 2025",
    location: "Bandung",
    image: "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=1200&h=800&fit=crop",
  },
  {
    id: 11,
    title: "Wisuda Anggota 2025",
    album: "kebersamaan",
    date: "15 Oktober 2025",
    location: "Graha ITS",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=800&fit=crop",
  },
  {
    id: 12,
    title: "Tech Talk Series",
    album: "seminar",
    date: "10 Oktober 2025",
    location: "Ruang Seminar",
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&h=800&fit=crop",
  },
]

export default function GaleriPage() {
  const [activeAlbum, setActiveAlbum] = useState("all")
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  const filteredGallery = galleryData.filter(
    (item) => activeAlbum === "all" || item.album === activeAlbum
  )

  const currentIndex = selectedImage !== null
    ? filteredGallery.findIndex((item) => item.id === selectedImage)
    : -1

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setSelectedImage(filteredGallery[currentIndex - 1].id)
    }
  }

  const handleNext = () => {
    if (currentIndex < filteredGallery.length - 1) {
      setSelectedImage(filteredGallery[currentIndex + 1].id)
    }
  }

  const selectedItem = selectedImage !== null
    ? galleryData.find((item) => item.id === selectedImage)
    : null

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
              <Camera className="mr-1.5 h-3 w-3" />
              Galeri Kegiatan
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl text-balance">
              Dokumentasi <span className="text-gradient">HIMA D3 SI</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Kumpulan momen berharga dari berbagai kegiatan dan event yang telah kami selenggarakan
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          {/* Album Filter */}
          <div className="mb-8 flex justify-center">
            <Tabs value={activeAlbum} onValueChange={setActiveAlbum}>
              <TabsList className="h-auto flex-wrap bg-muted/50 border border-border/50">
                {albums.map((album) => (
                  <TabsTrigger key={album.id} value={album.id} className="px-4 py-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                    {album.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Gallery Grid */}
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredGallery.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedImage(item.id)}
                className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-border/50 bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background transition-all duration-300 hover:border-primary/30 hover:glow-primary-sm"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/0 to-background/0 opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-left opacity-0 transition-opacity group-hover:opacity-100">
                  <h3 className="font-semibold line-clamp-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.date}</p>
                </div>
              </button>
            ))}
          </div>

          {filteredGallery.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-muted-foreground">Belum ada foto dalam album ini</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Dialog */}
      <Dialog open={selectedImage !== null} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-5xl border-border/50 bg-card/95 backdrop-blur p-0 shadow-xl">
          <div className="relative">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 z-10 text-foreground hover:bg-muted hover:text-primary"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-5 w-5" />
            </Button>

            {/* Navigation Buttons */}
            {currentIndex > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 z-10 -translate-y-1/2 text-foreground hover:bg-muted hover:text-primary"
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
            )}
            {currentIndex < filteredGallery.length - 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 z-10 -translate-y-1/2 text-foreground hover:bg-muted hover:text-primary"
                onClick={handleNext}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            )}

            {/* Image */}
            {selectedItem && (
              <div className="overflow-hidden rounded-lg">
                <Image
                  src={selectedItem.image}
                  alt={selectedItem.title}
                  width={1200}
                  height={800}
                  className="w-full"
                />
                <div className="bg-card p-4 border-t border-border/50">
                  <h3 className="text-lg font-semibold">{selectedItem.title}</h3>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-primary" />
                      {selectedItem.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-primary" />
                      {selectedItem.location}
                    </span>
                    <Badge className="capitalize bg-secondary/20 text-secondary hover:bg-secondary/30">
                      {selectedItem.album}
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Stats Section */}
      <section className="border-y border-border/50 bg-card/30 py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="group text-center p-4 rounded-xl border border-border/50 bg-card/50 transition-all duration-300 hover:border-primary/30 hover:glow-primary-sm">
              <div className="text-4xl font-bold text-gradient">500+</div>
              <div className="mt-1 text-sm text-muted-foreground">Total Foto</div>
            </div>
            <div className="group text-center p-4 rounded-xl border border-border/50 bg-card/50 transition-all duration-300 hover:border-secondary/30 hover:glow-secondary">
              <div className="text-4xl font-bold text-gradient">50+</div>
              <div className="mt-1 text-sm text-muted-foreground">Kegiatan</div>
            </div>
            <div className="group text-center p-4 rounded-xl border border-border/50 bg-card/50 transition-all duration-300 hover:border-primary/30 hover:glow-primary-sm">
              <div className="text-4xl font-bold text-gradient">10+</div>
              <div className="mt-1 text-sm text-muted-foreground">Album</div>
            </div>
            <div className="group text-center p-4 rounded-xl border border-border/50 bg-card/50 transition-all duration-300 hover:border-secondary/30 hover:glow-secondary">
              <div className="text-4xl font-bold text-gradient">5</div>
              <div className="mt-1 text-sm text-muted-foreground">Tahun Dokumentasi</div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-12 text-center">
            <Badge className="mb-4 border-primary/30 bg-primary/10 text-primary">
              <Play className="mr-1.5 h-3 w-3" />
              Video Highlight
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Dokumentasi Video
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Tonton video-video menarik dari kegiatan kami
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Highlight Seminar Nasional 2026",
                thumbnail: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=450&fit=crop",
                duration: "5:32",
              },
              {
                title: "Aftermovie Hackathon Internal",
                thumbnail: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=450&fit=crop",
                duration: "3:45",
              },
              {
                title: "Workshop UI/UX Recap",
                thumbnail: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&h=450&fit=crop",
                duration: "4:18",
              },
            ].map((video, index) => (
              <div
                key={index}
                className="group relative aspect-video cursor-pointer overflow-hidden rounded-xl border border-border/50 bg-muted transition-all duration-300 hover:border-primary/30 hover:glow-primary-sm"
              >
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-background/50 transition-colors group-hover:bg-background/60">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-brand text-primary-foreground shadow-lg transition-transform duration-300 group-hover:scale-110 glow-primary-sm">
                    <svg className="ml-1 h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 p-4">
                  <h3 className="font-semibold">{video.title}</h3>
                  <p className="text-sm text-muted-foreground">{video.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
