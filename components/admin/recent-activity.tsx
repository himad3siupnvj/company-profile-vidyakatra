import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const activities = [
  {
    id: 1,
    user: "Ahmad Rizki",
    avatar: "AR",
    action: "mempublikasikan berita acara",
    target: "Company Profile Vidyakatra",
    time: "2 jam lalu",
    type: "news",
  },
  {
    id: 2,
    user: "Siti Nurhaliza",
    avatar: "SN",
    action: "menambahkan pengurus",
    target: "Budi Santoso",
    time: "4 jam lalu",
    type: "member",
  },
  {
    id: 3,
    user: "Dian Permata",
    avatar: "DP",
    action: "mengajukan artikel",
    target: "Berita Acara Rapat Kabinet",
    time: "6 jam lalu",
    type: "article",
  },
  {
    id: 4,
    user: "Reza Firmansyah",
    avatar: "RF",
    action: "memperbarui insight",
    target: "Social Media Overview",
    time: "1 hari lalu",
    type: "social",
  },
  {
    id: 5,
    user: "Maya Indah",
    avatar: "MI",
    action: "mengedit konten",
    target: "Visi & Misi",
    time: "2 hari lalu",
    type: "content",
  },
]

const typeColors: Record<string, string> = {
  news: "bg-primary/10 text-primary",
  article: "bg-primary/10 text-primary",
  member: "bg-primary/10 text-primary",
  social: "bg-primary/10 text-primary",
  content: "bg-primary/10 text-primary",
}

export function RecentActivity() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Aktivitas Terbaru</CardTitle>
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
