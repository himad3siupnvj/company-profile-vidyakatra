import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  UserPlus,
  FileEdit,
  Settings,
  ArrowRight,
} from "lucide-react"

const actions = [
  {
    title: "Tambah Pengurus",
    description: "Tambahkan pengurus kabinet Vidyakatra",
    icon: UserPlus,
    href: "/x-panel/organization?action=add",
    color: "bg-primary/10 text-primary",
  },
  {
    title: "Buat Berita Acara",
    description: "Tulis draft berita acara untuk workflow approval",
    icon: FileEdit,
    href: "/x-panel/news?action=create",
    color: "bg-primary/10 text-primary",
  },
  {
    title: "Atur Social Overview",
    description: "Perbarui kanal dan insight sosial media",
    icon: Settings,
    href: "/x-panel/settings?tab=social",
    color: "bg-primary/10 text-primary",
  },
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Aksi Cepat</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        {actions.map((action) => (
          <Link key={action.title} href={action.href}>
            <Button
              variant="outline"
              className="h-auto w-full justify-start gap-4 border-white/10 bg-white/[0.02] p-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/[0.05] hover:shadow-[0_12px_30px_rgba(250,204,21,0.08)]"
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
        <Link href="/x-panel/settings" className="mt-2">
          <Button variant="secondary" className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <Settings className="h-4 w-4" />
            Kelola Pengaturan
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
