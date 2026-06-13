"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  Building2,
  Eye,
  FileText,
  Network,
  Newspaper,
  Share2,
} from "lucide-react"
import { StatsCard } from "@/components/admin/stats-card"
import { RecentActivity } from "@/components/admin/recent-activity"
import { QuickActions } from "@/components/admin/quick-actions"
import { LiveDateTime } from "@/components/admin/live-date-time"
import { OrganizationChart } from "@/components/admin/organization-chart"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { useAdminUser } from "@/components/admin/admin-user-context"
import { hasPermission } from "@/lib/permissions"
import type { RecentActivityItem } from "@/components/admin/recent-activity"

const dashboardRequestTimeoutMs = 8000

type DashboardSummary = {
  stats: {
    articles: {
      total: number
      views: number
      byStatus: Record<"draft" | "submitted" | "approved" | "rejected" | "published" | "archived", number>
    }
    organization: {
      units: number
      departments: number
      bureaus: number
    }
    users: {
      total: number
      active: number
      unclaimed: number
    }
  }
  editorialQueue: Array<{
    id: string
    title: string
    type: string
    owner: string
    status: string
  }>
  reviewQueue: Array<{
    id: string
    title: string
    owner: string
    status: string
  }>
  recentActivity: RecentActivityItem[]
  warning?: string
}

type OrganizationMember = {
  id: string
  name: string
  position: string
  department: string
  avatar: string
}

type OrganizationUnit = {
  id: string
  name: string
  type: "department" | "bureau"
  imageUrl: string
  color: string
  memberCount: number
}

function StatusBadge({ status }: { status: string }) {
  const normalizedStatus = status.toLowerCase()
  const label = normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1)
  const isReady = ["siap tayang", "aktif", "approved", "published"].includes(normalizedStatus)
  const isDraft = ["draft", "review", "submitted", "perlu review", "perlu update", "rejected"].includes(normalizedStatus)

  return (
    <Badge variant={isReady ? "default" : "secondary"} className={isDraft ? "bg-primary/10 text-primary" : undefined}>
      {label}
    </Badge>
  )
}

export default function AdminDashboard() {
  const { currentUser } = useAdminUser()
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [isLoadingSummary, setIsLoadingSummary] = useState(true)
  const [summaryError, setSummaryError] = useState("")
  const [organizationMembers, setOrganizationMembers] = useState<OrganizationMember[]>([])
  const [organizationUnits, setOrganizationUnits] = useState<OrganizationUnit[]>([])
  const [isLoadingOrganization, setIsLoadingOrganization] = useState(true)
  const role = currentUser?.role
  const canCreateArticle = Boolean(role && hasPermission(role, "article.create"))
  const canReviewArticles = Boolean(role && hasPermission(role, "article.review"))
  const canManageOrg = Boolean(role && (hasPermission(role, "member.manage") || hasPermission(role, "org_unit.manage")))
  const canManageSettings = Boolean(role && hasPermission(role, "settings.manage"))

  useEffect(() => {
    async function loadSummary() {
      setIsLoadingSummary(true)
      setSummaryError("")
      const controller = new AbortController()
      const timeoutId = window.setTimeout(() => controller.abort(), dashboardRequestTimeoutMs)

      try {
        const response = await fetch("/api/admin/dashboard", {
          cache: "no-store",
          signal: controller.signal,
        })
        const data = await response.json().catch(() => null)

        if (!response.ok) {
          setSummaryError(data?.error ?? "Dashboard gagal dimuat.")
          return
        }

        setSummary(data)
        if (data?.warning) {
          setSummaryError("Dashboard memakai data fallback karena database terlalu lama merespons.")
        }
      } catch (error) {
        setSummaryError(
          error instanceof DOMException && error.name === "AbortError"
            ? "Dashboard belum bisa mengambil data. Koneksi database terlalu lama merespons."
            : "Dashboard gagal dimuat. Coba refresh halaman.",
        )
      } finally {
        window.clearTimeout(timeoutId)
        setIsLoadingSummary(false)
      }
    }

    loadSummary()
  }, [])

  useEffect(() => {
    if (!canManageOrg) {
      setIsLoadingOrganization(false)
      return
    }

    async function loadOrganization() {
      try {
        const response = await fetch("/api/admin/organization", { cache: "no-store" })
        if (!response.ok) return

        const data = await response.json()
        setOrganizationMembers(data.members ?? [])
        setOrganizationUnits(data.organizationalUnits ?? [])
      } finally {
        setIsLoadingOrganization(false)
      }
    }

    void loadOrganization()
  }, [canManageOrg])

  const articleStats = summary?.stats.articles
  const organizationStats = summary?.stats.organization
  const userStats = summary?.stats.users
  const articleWorkflowTotal = articleStats
    ? articleStats.byStatus.published + articleStats.byStatus.submitted + articleStats.byStatus.draft + articleStats.byStatus.rejected
    : 0
  const contentHealth = [
    {
      label: "Profil organisasi",
      description: organizationStats
        ? `${organizationStats.departments} departemen dan ${organizationStats.bureaus} biro aktif di database.`
        : "Memuat struktur organisasi dari database.",
      status: organizationStats && organizationStats.units > 0 ? "Siap tayang" : "Perlu update",
      value: organizationStats?.units ? 100 : 0,
    },
    {
      label: "Berita acara",
      description: articleStats
        ? `${articleStats.byStatus.published} published, ${articleStats.byStatus.submitted} submitted, ${articleStats.byStatus.draft} draft.`
        : "Memuat status artikel dari database.",
      status: !articleStats?.total
        ? "Perlu update"
        : articleStats.byStatus.submitted + articleStats.byStatus.draft + articleStats.byStatus.rejected > 0
          ? "Perlu review"
          : "Siap tayang",
      value: articleWorkflowTotal ? Math.round((articleStats!.byStatus.published / articleWorkflowTotal) * 100) : 0,
    },
    {
      label: "Akun CMS",
      description: userStats
        ? `${userStats.active} aktif, ${userStats.unclaimed} belum claim.`
        : "Memuat status akun dari database.",
      status: userStats && userStats.total > 0 && userStats.unclaimed === 0 ? "Siap tayang" : "Perlu update",
      value: userStats?.total ? Math.round((userStats.active / userStats.total) * 100) : 0,
    },
  ]
  const visibleContentHealth = contentHealth.filter((item) => {
    if (item.label === "Profil organisasi") return canManageSettings || canManageOrg
    if (item.label === "Akun CMS") return canManageSettings

    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2">
            <Badge variant="outline">
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
              Lihat Situs
            </Link>
          </Button>
          {canCreateArticle && <Button asChild className="gap-2">
            <Link href="/x-panel/news?action=create">
              <FileText className="h-4 w-4" />
              Buat Berita
            </Link>
          </Button>}
        </div>
      </div>

      {summaryError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {summaryError}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {isLoadingSummary ? (
          Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-[142px]" />)
        ) : (
          <>
            <StatsCard
              title="Artikel"
              value={summary?.stats.articles.total ?? 0}
              change={`${summary?.stats.articles.byStatus.published ?? 0} published, ${summary?.stats.articles.byStatus.draft ?? 0} draft`}
              changeType="positive"
              icon={Newspaper}
            />
            {canManageOrg && <StatsCard
              title="Unit Kerja"
              value={summary?.stats.organization.units ?? 0}
              change={`${summary?.stats.organization.departments ?? 0} departemen, ${summary?.stats.organization.bureaus ?? 0} biro`}
              changeType="neutral"
              icon={Building2}
            />}
            {canManageSettings && <StatsCard
              title="Akun CMS"
              value={summary?.stats.users.total ?? 0}
              change={`${summary?.stats.users.active ?? 0} aktif, ${summary?.stats.users.unclaimed ?? 0} belum claim`}
              changeType={(summary?.stats.users.unclaimed ?? 0) > 0 ? "neutral" : "positive"}
              icon={Share2}
            />}
            <StatsCard
              title="Total Dilihat"
              value={(summary?.stats.articles.views ?? 0).toLocaleString()}
              change={`${summary?.stats.articles.byStatus.submitted ?? 0} menunggu review`}
              changeType={(summary?.stats.articles.byStatus.submitted ?? 0) > 0 ? "neutral" : "positive"}
              icon={Eye}
            />
          </>
        )}
      </div>

      {canManageOrg && (
        <Card>
          <CardHeader className="flex-row items-start justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <Network className="h-5 w-5 text-primary" />
                Struktur Organisasi
              </CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Ringkasan pimpinan, pengurus inti, departemen, dan biro aktif.
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/x-panel/organization?tab=structure">
                Kelola Struktur
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {isLoadingOrganization ? (
              <Skeleton className="h-72" />
            ) : organizationMembers.length === 0 && organizationUnits.length === 0 ? (
              <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                Struktur organisasi belum memiliki data.
              </div>
            ) : (
              <OrganizationChart
                members={organizationMembers}
                units={organizationUnits}
              />
            )}
          </CardContent>
        </Card>
      )}

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
            {isLoadingSummary ? Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-[106px]" />
            )) : visibleContentHealth.map((item) => (
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
            {isLoadingSummary ? Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-[62px]" />
            )) : summary?.editorialQueue.length ? summary.editorialQueue.map((item) => (
              <div key={item.title} className="flex items-start justify-between gap-3 rounded-lg border border-white/10 p-3">
                <div className="min-w-0">
                  <p className="truncate font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.type} - {item.owner}
                  </p>
                </div>
                <StatusBadge status={item.status} />
              </div>
            )) : (
              <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                Belum ada artikel di antrian editorial.
              </div>
            )}
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
          {isLoadingSummary ? <Skeleton className="h-[360px]" /> : <RecentActivity activities={summary?.recentActivity ?? []} />}
        </div>

        <div className="min-w-0 space-y-6">
          <QuickActions />

          {canReviewArticles && <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">Antrian Review</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {isLoadingSummary ? Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-[66px]" />
              )) : summary?.reviewQueue.length ? summary.reviewQueue.map((item) => (
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
              )) : (
                <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                  Tidak ada artikel yang menunggu review.
                </div>
              )}
            </CardContent>
          </Card>}
        </div>
      </div>

    </div>
  )
}
