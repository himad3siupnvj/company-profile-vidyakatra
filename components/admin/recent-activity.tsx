import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { getFirstNameInitial } from "@/lib/name-initials"

export type RecentActivityItem = {
  id: string
  user: string
  avatar: string
  action: string
  target: string
  time: string
  type: string
}

const typeColors: Record<string, string> = {
  news: "bg-primary/10 text-primary",
  article: "bg-primary/10 text-primary",
  member: "bg-primary/10 text-primary",
  social: "bg-primary/10 text-primary",
  content: "bg-primary/10 text-primary",
  cms: "bg-primary/10 text-primary",
}

export function RecentActivity({ activities }: { activities: RecentActivityItem[] }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Aktivitas Terbaru</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.length ? activities.map((activity) => (
          <div key={activity.id} className="flex min-w-0 items-start gap-3 sm:gap-4">
            <Avatar className="h-9 w-9 shrink-0">
              <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                {getFirstNameInitial(activity.user)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1 space-y-1">
              <p className="text-sm">
                <span className="font-medium">{activity.user}</span>{" "}
                <span className="text-muted-foreground">{activity.action}</span>{" "}
                <span className="font-medium">{activity.target}</span>
              </p>
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <Badge variant="secondary" className={`shrink-0 ${typeColors[activity.type] ?? typeColors.cms}`}>
                  {activity.type}
                </Badge>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            </div>
          </div>
        )) : (
          <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            Belum ada aktivitas yang tercatat.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
