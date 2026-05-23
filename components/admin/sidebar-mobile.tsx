"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import logoHima from "@/assets/hima.png"
import logoKabinet from "@/assets/logoKabinet.png"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Home,
  Users,
  Target,
  Newspaper,
  Image as ImageIcon,
  Settings,
  UserCog,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Home Page", href: "/admin/home", icon: Home },
  { name: "Organization", href: "/admin/organization", icon: Users },
  { name: "Vision & Mission", href: "/admin/vision-mission", icon: Target },
  { name: "Berita Acara", href: "/admin/news", icon: Newspaper },
  { name: "Galeri Media", href: "/admin/gallery", icon: ImageIcon },
  { name: "Settings", href: "/admin/settings", icon: Settings },
  { name: "User Management", href: "/admin/users", icon: UserCog },
]

export function AdminSidebarMobile() {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-sidebar-border px-4">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="flex shrink-0 items-center gap-1.5">
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-md bg-background">
              <Image src={logoHima} alt="Logo HIMA D3 SI UPNVJ" width={36} height={36} className="h-full w-full object-contain" />
            </div>
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-md bg-background">
              <Image src={logoKabinet} alt="Logo Kabinet Vidyakatra" width={36} height={36} className="h-full w-full object-contain" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-sidebar-foreground">HIMA D3 SI UPNVJ</span>
            <span className="text-xs text-sidebar-muted">Kabinet Vidyakatra CMS</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navigation.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== "/admin" && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-sidebar-primary")} />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
