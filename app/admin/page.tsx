import { Users, Building2, Eye, TrendingUp } from "lucide-react"
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
    title: "Company Profile Release",
    date: "Jun 20, 2026",
    status: "upcoming",
  },
  {
    id: 3,
    title: "Evaluasi Tengah Kabinet",
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
          Welcome back! Here&apos;s an overview of HIMA D3 Sistem Informasi UPNVJ - Kabinet Vidyakatra.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Members"
          value={156}
          change="+12 from last month"
          changeType="positive"
          icon={Users}
          iconColor="bg-primary/10 text-primary"
        />
        <StatsCard
          title="Unit Kerja"
          value={8}
          change="All active"
          changeType="neutral"
          icon={Building2}
          iconColor="bg-secondary/80 text-secondary-foreground"
        />
        <StatsCard
          title="Website Visitors"
          value="2,847"
          change="+18% this week"
          changeType="positive"
          icon={Eye}
          iconColor="bg-green-100 text-green-700"
        />
        <StatsCard
          title="Berita Acara"
          value={42}
          change="+5 this month"
          changeType="positive"
          icon={TrendingUp}
          iconColor="bg-blue-100 text-blue-700"
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
