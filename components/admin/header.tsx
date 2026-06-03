"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bell, ExternalLink, Search, Menu, LogOut, User, Settings, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { AdminSidebarMobile } from "./sidebar-mobile"
import { useAdminUser } from "@/components/admin/admin-user-context"

interface AdminHeaderProps {
  sidebarCollapsed?: boolean
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function AdminHeader({ sidebarCollapsed }: AdminHeaderProps) {
  const router = useRouter()
  const [searchOpen, setSearchOpen] = useState(false)
  const { currentUser } = useAdminUser()

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/x-panel/login")
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 min-w-0 items-center justify-between gap-2 border-b border-white/10 bg-background/55 px-3 backdrop-blur-xl supports-[backdrop-filter]:bg-background/35 sm:px-4 md:px-6">
      {/* Mobile Menu */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 max-w-[85vw] p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Admin navigation</SheetTitle>
          </SheetHeader>
          <AdminSidebarMobile />
        </SheetContent>
      </Sheet>

      {/* Search - Desktop */}
      <div className="hidden flex-1 md:block md:max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari konten, pengurus, atau pengaturan..."
            className="w-full border-white/10 bg-white/[0.03] pl-9 focus:bg-card"
          />
        </div>
      </div>

      {/* Search - Mobile */}
      <div className="min-w-0 flex-1 md:hidden">
        {searchOpen ? (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari konten..."
              className="h-9 w-full rounded-full border-white/10 bg-white/[0.04] pl-9 pr-9"
              autoFocus
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="absolute right-1 top-1/2 -translate-y-1/2"
              onClick={() => setSearchOpen(false)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Tutup pencarian</span>
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            className="h-9 w-full justify-start gap-2 rounded-full border-white/10 bg-white/[0.03] px-3 text-muted-foreground"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-4 w-4 shrink-0" />
            <span className="truncate text-xs">Cari konten...</span>
          </Button>
        )}
      </div>

      {/* Right Section */}
      <div className={searchOpen ? "hidden min-w-0 items-center gap-1 sm:gap-2 md:flex" : "flex min-w-0 items-center gap-1 sm:gap-2"}>
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs">
                3
              </Badge>
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[calc(100vw-2rem)] max-w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
              <p className="font-medium">Pengurus baru ditambahkan</p>
              <p className="text-sm text-muted-foreground">Data struktur Kabinet Vidyakatra diperbarui</p>
              <p className="text-xs text-muted-foreground">2 jam lalu</p>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
              <p className="font-medium">Berita acara dipublikasikan</p>
              <p className="text-sm text-muted-foreground">Konten sosial media overview sudah tayang</p>
              <p className="text-xs text-muted-foreground">5 jam lalu</p>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
              <p className="font-medium">Artikel menunggu review</p>
              <p className="text-sm text-muted-foreground">Draft berita acara siap dicek reviewer</p>
              <p className="text-xs text-muted-foreground">1 hari lalu</p>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-primary">
              Lihat semua notifikasi
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button asChild variant="outline" size="sm" className="hidden gap-2 border-white/10 bg-white/[0.03] hover:bg-white/[0.06] md:inline-flex">
          <Link href="/" target="_blank">
            <ExternalLink className="h-4 w-4" />
            Lihat Site
          </Link>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex min-w-0 items-center gap-2 px-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-avatar.jpg" alt={currentUser?.name ?? "Admin"} />
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  {getInitials(currentUser?.name ?? "Admin")}
                </AvatarFallback>
              </Avatar>
              <div className="hidden flex-col items-start md:flex">
                <span className="text-sm font-medium">{currentUser?.name ?? "Admin"}</span>
                <span className="text-xs text-muted-foreground">{currentUser?.email ?? "Memuat akun..."}</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Akun Admin</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profil
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Pengaturan
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
