import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const activities = [
  {
    id: 1,
    user: "Ahmad Rizki",
    avatar: "AR",
    action: "published a new article",
    target: "Seminar IT 2024",
    time: "2 hours ago",
    type: "news",
  },
  {
    id: 2,
    user: "Siti Nurhaliza",
    avatar: "SN",
    action: "added a new member",
    target: "Budi Santoso",
    time: "4 hours ago",
    type: "member",
  },
  {
    id: 3,
    user: "Dian Permata",
    avatar: "DP",
    action: "updated the event",
    target: "Workshop Programming",
    time: "6 hours ago",
    type: "event",
  },
  {
    id: 4,
    user: "Reza Firmansyah",
    avatar: "RF",
    action: "uploaded images to",
    target: "Gallery Kegiatan 2024",
    time: "1 day ago",
    type: "media",
  },
  {
    id: 5,
    user: "Maya Indah",
    avatar: "MI",
    action: "edited the",
    target: "Vision & Mission",
    time: "2 days ago",
    type: "content",
  },
]

const typeColors: Record<string, string> = {
  news: "bg-blue-100 text-blue-700",
  member: "bg-green-100 text-green-700",
  event: "bg-orange-100 text-orange-700",
  media: "bg-purple-100 text-purple-700",
  content: "bg-primary/10 text-primary",
}

export function RecentActivity() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-4">
            <Avatar className="h-9 w-9">
              <AvatarImage src={`/avatars/${activity.id}.jpg`} />
              <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                {activity.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <p className="text-sm">
                <span className="font-medium">{activity.user}</span>{" "}
                <span className="text-muted-foreground">{activity.action}</span>{" "}
                <span className="font-medium">{activity.target}</span>
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className={typeColors[activity.type]}>
                  {activity.type}
                </Badge>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
