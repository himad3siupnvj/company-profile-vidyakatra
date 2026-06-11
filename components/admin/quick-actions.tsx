import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  UserPlus,
  FileEdit,
  Settings,
  ArrowRight,
} from "lucide-react"
import { getAccessibleQuickActions } from "@/lib/admin-access"
import { useAdminUser } from "@/components/admin/admin-user-context"

const actionIcons = {
  "Tambah Pengurus": UserPlus,
  "Buat Berita Acara": FileEdit,
  "Atur Social Overview": Settings,
} as const

export function QuickActions() {
  const { currentUser } = useAdminUser()
  const actions = getAccessibleQuickActions(currentUser?.role)

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Aksi Cepat</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        {actions.map((action) => {
          const Icon = actionIcons[action.title as keyof typeof actionIcons] ?? ArrowRight

          return (
          <Link key={action.title} href={action.href} className="min-w-0">
            <Button
              variant="outline"
              className="h-auto w-full min-w-0 justify-start gap-3 whitespace-normal p-3 text-left transition-colors hover:border-primary/30 sm:gap-4 sm:p-4"
            >
              <div className="shrink-0 rounded-lg bg-primary/10 p-2 text-primary">
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{action.title}</p>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            </Button>
          </Link>
          )
        })}
        {actions.length === 0 && (
          <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
            Tidak ada aksi cepat untuk role ini.
          </div>
        )}
        {currentUser?.role && actions.some((action) => action.href.startsWith("/x-panel/settings")) && <Link href="/x-panel/settings" className="mt-2">
          <Button variant="secondary" className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <Settings className="h-4 w-4" />
            Kelola Pengaturan
          </Button>
        </Link>}
      </CardContent>
    </Card>
  )
}
