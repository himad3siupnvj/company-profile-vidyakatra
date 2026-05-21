"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Home,
  Users,
  Target,
  Newspaper,
  Image,
  Settings,
  UserCog,
  ChevronLeft,
  ChevronRight,
  Zap,
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
    name: "News & Events",
    href: "/admin/news",
    icon: Newspaper,
  },
  {
    name: "Media Gallery",
    href: "/admin/gallery",
    icon: Image,
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
              <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-brand transition-all duration-300 group-hover:glow-primary-sm">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-wide text-sidebar-foreground">HIMA D3 SI</span>
                <span className="text-xs text-sidebar-muted">Admin Panel</span>
              </div>
            </Link>
          )}
          {collapsed && (
            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-brand">
              <Zap className="h-5 w-5 text-primary-foreground" />
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
