"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
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
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Home Page",
    href: "/admin/home",
    icon: Home,
  },
  {
    name: "Organization",
    href: "/admin/organization",
    icon: Users,
  },
  {
    name: "Vision & Mission",
    href: "/admin/vision-mission",
    icon: Target,
  },
  {
    name: "Berita Acara",
    href: "/admin/news",
    icon: Newspaper,
  },
  {
    name: "Galeri Media",
    href: "/admin/gallery",
    icon: ImageIcon,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
  {
    name: "User Management",
    href: "/admin/users",
    icon: UserCog,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          {!collapsed && (
            <Link href="/admin" className="group flex items-center gap-2">
              <div className="flex shrink-0 items-center gap-1.5">
                <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-md bg-background">
                  <Image src={logoHima} alt="Logo HIMA D3 SI UPNVJ" width={36} height={36} className="h-full w-full object-contain" />
                </div>
                <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-md bg-background">
                  <Image src={logoKabinet} alt="Logo Kabinet Vidyakatra" width={36} height={36} className="h-full w-full object-contain" />
                </div>
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-bold tracking-wide text-sidebar-foreground">HIMA D3 SI UPNVJ</span>
                <span className="text-xs text-sidebar-muted">Kabinet Vidyakatra CMS</span>
              </div>
            </Link>
          )}
          {collapsed && (
            <div className="mx-auto flex h-9 w-9 items-center justify-center overflow-hidden rounded-md bg-background">
              <Image src={logoHima} alt="Logo HIMA D3 SI UPNVJ" width={36} height={36} className="h-full w-full object-contain" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== "/admin" && pathname.startsWith(item.href))
            
            const linkContent = (
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-300",
                  isActive
                    ? "bg-sidebar-primary/10 text-sidebar-primary border border-sidebar-primary/20 glow-primary-sm"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-sidebar-primary")} />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            )

            if (collapsed) {
              return (
                <Tooltip key={item.name}>
                  <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                  <TooltipContent side="right" className="border-border bg-card text-card-foreground">
                    {item.name}
                  </TooltipContent>
                </Tooltip>
              )
            }

            return <div key={item.name}>{linkContent}</div>
          })}
        </nav>

        {/* View Site Button */}
        <div className="border-t border-sidebar-border p-3">
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/" target="_blank">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-center text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="border-border bg-card text-card-foreground">
                View Site
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link href="/" target="_blank">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2 text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground"
              >
                <ExternalLink className="h-4 w-4" />
                View Site
              </Button>
            </Link>
          )}
        </div>

        {/* Collapse Button */}
        <div className="border-t border-sidebar-border p-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="w-full justify-center text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground transition-all duration-300"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 mr-2" />
                <span>Collapse</span>
              </>
            )}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  )
}
