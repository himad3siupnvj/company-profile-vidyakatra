"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { Eye, ImagePlus, Loader2, Save, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { optimizeImageForUpload } from "@/lib/client-image-processing"
import {
  defaultHomeContent,
  type PublicHomeContent,
} from "@/lib/home-content"
import { validateHomeContent } from "@/lib/settings-validation"

type HomeStats = {
  activeMembers: number
  activeUnits: number
  publishedArticles: number
  activePeriod: string
}

export default function HomePageManagement() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [content, setContent] = useState<PublicHomeContent>(defaultHomeContent)
  const [stats, setStats] = useState<HomeStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    async function loadData() {
      try {
        const [settingsResponse, statsResponse] = await Promise.all([
          fetch("/api/admin/settings"),
          fetch("/api/admin/home-stats"),
        ])
        if (settingsResponse.ok) {
          const settings = await settingsResponse.json()
          if (settings.homeContent) setContent(settings.homeContent)
        }
        if (statsResponse.ok) {
          const data = await statsResponse.json()
          setStats(data)
        }
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  async function saveChanges() {
    const validationError = validateHomeContent(content)
    if (validationError) {
      setMessage(validationError)
      return
    }
    setIsSaving(true)
    setMessage("")
    try {
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ homeContent: content }),
      })
      const data = await response.json()
      setMessage(response.ok ? "Perubahan Beranda berhasil disimpan." : data.error || "Gagal menyimpan perubahan.")
    } catch {
      setMessage("Gagal menyimpan perubahan.")
    } finally {
      setIsSaving(false)
    }
  }

  async function uploadHeroImage(file: File) {
    if (!file.type.startsWith("image/")) {
      setMessage("Pilih file gambar yang valid.")
      return
    }
    setIsUploading(true)
    setMessage("")
    try {
      const optimizedFile = await optimizeImageForUpload(file, {
        maxWidth: 1920,
        maxHeight: 1080,
        quality: 0.8,
      })
      const formData = new FormData()
      formData.append("file", optimizedFile)
      formData.append("purpose", "article-image")
      formData.append("section", "home")
      formData.append("category", "homepage")
      formData.append("kind", "hero")
      formData.append("year", new Date().getFullYear().toString())

      const response = await fetch("/api/admin/assets", { method: "POST", body: formData })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Unggah gambar gagal.")

      setContent((current) => ({
        ...current,
        hero: { ...current.hero, backgroundImage: data.asset.url },
      }))
      setMessage("Gambar berhasil diunggah. Simpan perubahan untuk menerbitkannya.")
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unggah gambar gagal.")
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-64 items-center justify-center text-muted-foreground">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Memuat pengaturan Beranda...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Pengelolaan Beranda</h1>
          <p className="text-muted-foreground">Kelola konten utama yang tampil pada halaman Beranda.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => window.open("/", "_blank", "noopener,noreferrer")}>
            <Eye className="h-4 w-4" />
            Pratinjau
          </Button>
          <Button className="gap-2" onClick={saveChanges} disabled={isSaving || isUploading}>
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Simpan
          </Button>
        </div>
      </div>

      {message && <p className="rounded-lg border bg-card px-4 py-3 text-sm">{message}</p>}

      <Card>
        <CardHeader>
          <CardTitle>Banner Utama</CardTitle>
          <CardDescription>Judul dan foto kabinet pada bagian teratas Beranda.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="hero-title">Judul</Label>
              <Input id="hero-title" value={content.hero.title} onChange={(event) => setContent({ ...content, hero: { ...content.hero, title: event.target.value } })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero-subtitle">Subjudul</Label>
              <Input id="hero-subtitle" value={content.hero.subtitle} onChange={(event) => setContent({ ...content, hero: { ...content.hero, subtitle: event.target.value } })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero-year">Tahun</Label>
              <Input id="hero-year" value={content.hero.year} onChange={(event) => setContent({ ...content, hero: { ...content.hero, year: event.target.value } })} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Gambar Banner</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (file) void uploadHeroImage(file)
              }}
            />
            <button
              type="button"
              className="relative flex aspect-[21/9] w-full max-w-3xl items-center justify-center overflow-hidden rounded-xl border border-dashed bg-muted/40 text-muted-foreground transition-colors hover:border-primary"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {content.hero.backgroundImage ? (
                <Image src={content.hero.backgroundImage} alt="Pratinjau banner Beranda" fill className="object-cover" unoptimized />
              ) : (
                <span className="flex flex-col items-center gap-2">
                  <ImagePlus className="h-8 w-8" />
                  Klik untuk memilih gambar
                </span>
              )}
              {isUploading && (
                <span className="absolute inset-0 flex items-center justify-center bg-background/80">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Mengunggah...
                </span>
              )}
            </button>
            <Button type="button" variant="outline" className="gap-2" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
              <Upload className="h-4 w-4" />
              Ubah Gambar
            </Button>
            <p className="text-xs text-muted-foreground">Format JPG, PNG, atau WebP. Gambar otomatis dioptimalkan ke ukuran maksimal 1920 x 1080 piksel.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Video Profil</CardTitle>
          <CardDescription>Gunakan URL embed YouTube agar video dapat ditampilkan langsung.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="video-title">Judul</Label>
            <Input id="video-title" value={content.video.title} onChange={(event) => setContent({ ...content, video: { ...content.video, title: event.target.value } })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="video-description">Deskripsi</Label>
            <Textarea id="video-description" value={content.video.description} onChange={(event) => setContent({ ...content, video: { ...content.video, description: event.target.value } })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="video-url">URL Embed</Label>
            <Input id="video-url" value={content.video.url} onChange={(event) => setContent({ ...content, video: { ...content.video, url: event.target.value } })} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Statistik Otomatis</CardTitle>
          <CardDescription>Angka berikut dihitung langsung dari data CMS dan tidak perlu diedit manual.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Anggota Aktif", stats?.activeMembers ?? 0],
            ["Unit Kerja Aktif", stats?.activeUnits ?? 0],
            ["Berita Terbit", stats?.publishedArticles ?? 0],
            ["Periode Aktif", stats?.activePeriod ?? "-"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border p-4">
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-sm text-muted-foreground">{label}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Ajakan</CardTitle>
            <CardDescription>Bagian penutup Beranda yang mengarah ke halaman lain.</CardDescription>
          </div>
          <Switch checked={content.cta.enabled} onCheckedChange={(enabled) => setContent({ ...content, cta: { ...content.cta, enabled } })} />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cta-title">Judul</Label>
            <Input id="cta-title" value={content.cta.title} onChange={(event) => setContent({ ...content, cta: { ...content.cta, title: event.target.value } })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cta-description">Deskripsi</Label>
            <Textarea id="cta-description" value={content.cta.description} onChange={(event) => setContent({ ...content, cta: { ...content.cta, description: event.target.value } })} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="cta-button">Teks Tombol</Label>
              <Input id="cta-button" value={content.cta.buttonText} onChange={(event) => setContent({ ...content, cta: { ...content.cta, buttonText: event.target.value } })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cta-link">Tautan Tombol</Label>
              <Input id="cta-link" value={content.cta.buttonLink} onChange={(event) => setContent({ ...content, cta: { ...content.cta, buttonLink: event.target.value } })} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
