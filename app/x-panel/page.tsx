import Link from "next/link"
import {
  AlertCircle,
  ArrowRight,
  Building2,
  CheckCircle2,
  Eye,
  FileText,
  Newspaper,
  Share2,
  Sparkles,
} from "lucide-react"
import { StatsCard } from "@/components/admin/stats-card"
import { RecentActivity } from "@/components/admin/recent-activity"
import { QuickActions } from "@/components/admin/quick-actions"
import { LiveDateTime } from "@/components/admin/live-date-time"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const contentHealth = [
  {
    label: "Profil organisasi",
    description: "Struktur dan copy publik sudah selaras dengan Vidyakatra.",
    status: "Siap tayang",
    value: 92,
  },
  {
    label: "Berita acara",
    description: "2 draft menunggu finalisasi thumbnail dan excerpt.",
    status: "Perlu review",
    value: 68,
  },
  {
    label: "Social media overview",
    description: "Link kanal sudah lengkap, insight bulanan belum diperbarui.",
    status: "Perlu update",
    value: 74,
  },
]

const editorialQueue = [
  {
    title: "Company Profile Vidyakatra",
    type: "Artikel",
    owner: "Media & Informasi",
    status: "Draft",
  },
  {
    title: "Berita Acara Rapat Kabinet",
    type: "Artikel",
    owner: "Sekretariat",
    status: "Submitted",
  },
  {
    title: "Social Media Overview",
    type: "Setting",
    owner: "Humas",
    status: "Review",
  },
]

const reviewQueue = [
  {
    title: "Berita Acara Rapat Kabinet",
    owner: "Sekretariat",
    status: "Submitted",
  },
  {
    title: "Company Profile Vidyakatra",
    owner: "Media & Informasi",
    status: "Draft",
  },
  {
    title: "Social Media Overview",
    owner: "Humas",
    status: "Review",
  },
]

const socialChannels = [
  { name: "Instagram", handle: "@himad3si_upnvj", reach: "2.5K+", status: "Aktif" },
  { name: "YouTube", handle: "HIMA D3 SI UPNVJ", reach: "320+", status: "Perlu konten" },
  { name: "LinkedIn", handle: "HIMA D3SI UPNVJ", reach: "180+", status: "Aktif" },
]

function StatusBadge({ status }: { status: string }) {
  const isReady = ["Siap tayang", "Aktif", "Approved"].includes(status)
  const isDraft = ["Draft", "Review", "Submitted", "Perlu review", "Perlu update"].includes(status)

  return (
    <Badge variant={isReady ? "default" : "secondary"} className={isDraft ? "bg-primary/10 text-primary" : undefined}>
      {status}
    </Badge>
  )
}

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Badge variant="secondary" className="gap-1 bg-primary/10 text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Admin CMS
            </Badge>
            <Badge variant="outline" className="border-white/10">
              <LiveDateTime />
            </Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Dashboard</h1>
          <p className="max-w-2xl text-muted-foreground">
            Pantau kesiapan konten public site, pengurus, workflow artikel, dan kanal digital Kabinet Vidyakatra.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button asChild variant="outline" className="gap-2 border-white/10 bg-white/[0.03]">
            <Link href="/">
              <Eye className="h-4 w-4" />
              Preview Site
            </Link>
          </Button>
          <Button asChild className="gap-2">
            <Link href="/x-panel/news?action=create">
              <FileText className="h-4 w-4" />
              Buat Berita
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Section Public"
          value={4}
          change="Beranda, Profil, Berita, Collaborate"
          changeType="positive"
          icon={Eye}
        />
        <StatsCard
          title="Unit Kerja"
          value={6}
          change="4 departemen, 2 biro"
          changeType="neutral"
          icon={Building2}
        />
        <StatsCard
          title="Reach Sosial"
          value="2.5K+"
          change="Instagram akun terjangkau"
          changeType="positive"
          icon={Share2}
        />
        <StatsCard
          title="Berita Acara"
          value={6}
          change="4 published, 2 draft"
          changeType="positive"
          icon={Newspaper}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-4">
              <CardTitle className="text-lg font-semibold">Kesiapan Konten</CardTitle>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                3 prioritas
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {contentHealth.map((item) => (
              <div key={item.label} className="space-y-2 rounded-lg border border-white/10 bg-white/[0.02] p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
                <Progress value={item.value} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">Antrian Editorial</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {editorialQueue.map((item) => (
              <div key={item.title} className="flex items-start justify-between gap-3 rounded-lg border border-white/10 p-3">
                <div className="min-w-0">
                  <p className="truncate font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.type} - {item.owner}
                  </p>
                </div>
                <StatusBadge status={item.status} />
              </div>
            ))}
            <Button asChild variant="secondary" className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/x-panel/news">
                Kelola Editorial
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid min-w-0 gap-6 xl:grid-cols-3">
        <div className="min-w-0 xl:col-span-2">
          <RecentActivity />
        </div>

        <div className="min-w-0 space-y-6">
          <QuickActions />

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">Antrian Review</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {reviewQueue.map((item) => (
                <div key={item.title} className="flex min-w-0 items-start gap-3 rounded-lg border border-white/10 p-3">
                  <div className="shrink-0 rounded-lg bg-primary/10 p-2 text-primary">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.owner}</p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Kanal Digital</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          {socialChannels.map((channel) => (
            <div key={channel.name} className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="font-medium">{channel.name}</p>
                {channel.status === "Aktif" ? (
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">{channel.handle}</p>
              <div className="mt-4 flex items-end justify-between">
                <p className="text-2xl font-bold">{channel.reach}</p>
                <StatusBadge status={channel.status} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
