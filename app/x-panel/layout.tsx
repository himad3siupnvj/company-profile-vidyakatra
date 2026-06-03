"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminHeader } from "@/components/admin/header"
import { AdminUserProvider, type AdminCurrentUser } from "@/components/admin/admin-user-context"
import { canAccessAdminPath } from "@/lib/admin-access"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<AdminCurrentUser | null>(null)
  const [isLoadingUser, setIsLoadingUser] = useState(true)

  useEffect(() => {
    let active = true

    async function loadCurrentUser() {
      setIsLoadingUser(true)

      try {
        const response = await fetch("/api/auth/me", { cache: "no-store" })

        if (!response.ok) {
          if (active) setCurrentUser(null)
          router.replace("/x-panel/login")
          return
        }

        const data = await response.json()

        if (active) {
          setCurrentUser(data.user ?? null)
        }
      } catch {
        if (active) setCurrentUser(null)
        router.replace("/x-panel/login")
      } finally {
        if (active) setIsLoadingUser(false)
      }
    }

    if (pathname !== "/x-panel/login") {
      loadCurrentUser()
    } else {
      setIsLoadingUser(false)
    }

    return () => {
      active = false
    }
  }, [pathname, router])

  useEffect(() => {
    if (isLoadingUser || pathname === "/x-panel/login") return
    if (!currentUser) return

    if (!canAccessAdminPath(currentUser.role, pathname)) {
      router.replace("/x-panel")
    }
  }, [currentUser, isLoadingUser, pathname, router])

  if (pathname === "/x-panel/login") {
    return <>{children}</>
  }

  return (
    <AdminUserProvider currentUser={currentUser} isLoadingUser={isLoadingUser}>
      <div className="min-h-screen overflow-x-hidden bg-background">
        {/* Sidebar - hidden on mobile */}
        <div className="hidden md:block">
          <AdminSidebar />
        </div>

        {/* Main Content */}
        <div className="flex min-w-0 flex-col md:ml-64">
          <AdminHeader />
          <main className="min-w-0 flex-1 overflow-x-hidden p-3 sm:p-4 md:p-6">{children}</main>
        </div>
      </div>
    </AdminUserProvider>
  )
}
