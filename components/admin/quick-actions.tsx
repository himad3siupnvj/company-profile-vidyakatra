import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  UserPlus,
  FileEdit,
  ImagePlus,
  Calendar,
  Settings,
  ArrowRight,
} from "lucide-react"

const actions = [
  {
    title: "Add Member",
    description: "Register a new organization member",
    icon: UserPlus,
    href: "/admin/organization?action=add",
    color: "bg-green-100 text-green-700",
  },
  {
    title: "Create Article",
    description: "Write and publish a news article",
    icon: FileEdit,
    href: "/admin/news?action=create",
    color: "bg-blue-100 text-blue-700",
  },
  {
    title: "Upload Media",
    description: "Add photos to the gallery",
    icon: ImagePlus,
    href: "/admin/gallery?action=upload",
    color: "bg-purple-100 text-purple-700",
  },
  {
    title: "Create Event",
    description: "Schedule a new event",
    icon: Calendar,
    href: "/admin/news?tab=events&action=create",
    color: "bg-orange-100 text-orange-700",
  },
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        {actions.map((action) => (
          <Link key={action.title} href={action.href}>
            <Button
              variant="outline"
              className="h-auto w-full justify-start gap-4 p-4 text-left hover:bg-muted/50"
            >
              <div className={`rounded-lg p-2 ${action.color}`}>
                <action.icon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{action.title}</p>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Button>
          </Link>
        ))}
        <Link href="/admin/settings" className="mt-2">
          <Button variant="secondary" className="w-full gap-2">
            <Settings className="h-4 w-4" />
            Manage Settings
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
