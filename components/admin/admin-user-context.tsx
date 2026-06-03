"use client"

import { createContext, useContext } from "react"
import type { UserRole } from "@/lib/permissions"

export type AdminCurrentUser = {
  id: string
  name: string
  email: string
  role: UserRole
}

type AdminUserContextValue = {
  currentUser: AdminCurrentUser | null
  isLoadingUser: boolean
}

const AdminUserContext = createContext<AdminUserContextValue>({
  currentUser: null,
  isLoadingUser: true,
})

export function AdminUserProvider({
  children,
  currentUser,
  isLoadingUser,
}: AdminUserContextValue & {
  children: React.ReactNode
}) {
  return <AdminUserContext.Provider value={{ currentUser, isLoadingUser }}>{children}</AdminUserContext.Provider>
}

export function useAdminUser() {
  return useContext(AdminUserContext)
}
