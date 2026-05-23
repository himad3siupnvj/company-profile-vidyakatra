import { Building2, Eye, Newspaper, Share2 } from "lucide-react"
import { StatsCard } from "@/components/admin/stats-card"
import { RecentActivity } from "@/components/admin/recent-activity"
import { QuickActions } from "@/components/admin/quick-actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const upcomingEvents = [
  {
    id: 1,
    title: "Rapat Kabinet Vidyakatra",
    date: "Jun 15, 2026",
    status: "upcoming",
  },
  {
    id: 2,
    title: "Review Social Media Overview",
    date: "Jun 20, 2026",
    status: "upcoming",
  },
  {
    id: 3,
    title: "Update Berita Acara",
    date: "Jun 28, 2026",
    status: "planning",
  },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Dashboard</h1>
        <p className="text-muted-foreground">
          Pantau konten public site, agenda, dan kanal digital Kabinet Vidyakatra dalam satu dashboard.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Section Public"
          value={4}
          change="Beranda, Profil, Berita, Collaborate"
          changeType="positive"
          icon={Eye}
          iconColor="bg-primary/10 text-primary"
        />
        <StatsCard
          title="Unit Kerja"
          value={6}
          change="4 departemen, 2 biro"
          changeType="neutral"
          icon={Building2}
          iconColor="bg-primary/10 text-primary"
        />
        <StatsCard
          title="Social Reach"
          value="2.5K+"
          change="Instagram akun terjangkau"
          changeType="positive"
          icon={Share2}
          iconColor="bg-primary/10 text-primary"
        />
        <StatsCard
          title="Berita Acara"
          value={6}
          change="Konten dummy aktif"
          changeType="positive"
          icon={Newspaper}
          iconColor="bg-primary/10 text-primary"
        />
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity - Takes 2 columns */}
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <QuickActions />

          {/* Upcoming Agenda */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">Agenda Terdekat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-muted-foreground">{event.date}</p>
                  </div>
                  <Badge
                    variant={event.status === "upcoming" ? "default" : "secondary"}
                  >
                    {event.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
