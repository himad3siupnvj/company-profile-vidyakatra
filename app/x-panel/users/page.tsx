"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Key, Loader2, MoreHorizontal, Plus, Search, Shield, Trash2, UserCog, Users } from "lucide-react"
import { getPermissions, getRoleGroup, roleLabels, type UserRole, userRoles } from "@/lib/permissions"
import { getFirstNameInitial } from "@/lib/name-initials"

interface User {
  id: string
  name: string
  email: string
  role: UserRole
  status: "unclaimed" | "active" | "inactive"
  claimCode: string | null
  lastLogin: string
  createdAt: string
}

interface MemberOption {
  id: string
  name: string
  email: string
  department: string
  position: string
}

const roleGroupMeta = {
  super_admin: {
    label: "Super Admin",
    description: "Akses penuh untuk seluruh fitur CMS.",
    color: "bg-primary text-primary-foreground",
  },
  executive: {
    label: "Executive",
    description: "Akses pimpinan organisasi untuk konten dan data utama.",
    color: "bg-primary/10 text-primary",
  },
  reviewer: {
    label: "Reviewer",
    description: "Akses review, approval, publish artikel, dan upload media.",
    color: "bg-blue-100 text-blue-700",
  },
  contributor: {
    label: "Contributor",
    description: "Akses membuat, mengedit milik sendiri, submit artikel, dan upload media pribadi.",
    color: "bg-secondary text-secondary-foreground",
  },
}

const roleOptions = userRoles.map((role) => ({
  value: role,
  label: roleLabels[role],
  group: getRoleGroup(role),
  permissions: getPermissions(role),
}))

const statusLabels: Record<User["status"], string> = {
  unclaimed: "Belum diklaim",
  active: "Aktif",
  inactive: "Nonaktif",
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [members, setMembers] = useState<MemberOption[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterRole, setFilterRole] = useState<string>("all")
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [newUser, setNewUser] = useState({
    memberId: "",
    name: "",
    email: "",
    role: "" as UserRole | "",
  })

  useEffect(() => {
    async function loadData() {
      try {
        const [usersResponse, organizationResponse] = await Promise.all([
          fetch("/api/admin/users"),
          fetch("/api/admin/organization"),
        ])

        const usersData = await usersResponse.json()
        if (!usersResponse.ok) throw new Error(usersData.error || "Data pengguna gagal dimuat.")
        setUsers(usersData.users)

        const organizationData = await organizationResponse.json()
        if (!organizationResponse.ok) throw new Error(organizationData.error || "Data anggota gagal dimuat.")
        setMembers(organizationData.members)
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Data pengguna gagal dimuat.")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = filterRole === "all" || user.role === filterRole
    return matchesSearch && matchesRole
  })

  const handleAddUser = async () => {
    if (!newUser.memberId || !newUser.email || !newUser.role) {
      setMessage("Pilih anggota, pastikan email tersedia, lalu tentukan peran CMS.")
      return
    }

    setIsSubmitting(true)
    setMessage("")
    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Pengguna gagal dibuat.")
      setUsers((currentUsers) => [data.user, ...currentUsers])
      setNewUser({ memberId: "", name: "", email: "", role: "" })
      setIsAddUserOpen(false)
      setMessage(`Akun ${data.user.name} berhasil dibuat. Kode klaim: ${data.user.claimCode}`)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Pengguna gagal dibuat.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteUser = async (id: string) => {
    const previousUsers = users
    setUsers(users.filter(u => u.id !== id))

    try {
      const response = await fetch(`/api/admin/users?id=${id}`, { method: "DELETE" })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Pengguna gagal dinonaktifkan.")
      setMessage("Pengguna berhasil dinonaktifkan.")
    } catch (error) {
      setUsers(previousUsers)
      setMessage(error instanceof Error ? error.message : "Pengguna gagal dinonaktifkan.")
    }
  }

  const toggleUserStatus = async (id: string) => {
    const targetUser = users.find((user) => user.id === id)
    if (!targetUser) return

    const previousUsers = users
    const nextStatus = targetUser.status === "active" ? "inactive" : "active"

    setUsers(users.map(u =>
      u.id === id ? { ...u, status: nextStatus } : u
    ))

    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: nextStatus }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Status pengguna gagal diubah.")
      setUsers((currentUsers) => currentUsers.map((user) => (user.id === id ? data.user : user)))
      setMessage("Status pengguna berhasil diperbarui.")
    } catch (error) {
      setUsers(previousUsers)
      setMessage(error instanceof Error ? error.message : "Status pengguna gagal diubah.")
    }
  }

  const handleResetPassword = async (id: string) => {
    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "reset_password" }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Password pengguna gagal direset.")
      setUsers((currentUsers) => currentUsers.map((user) => (user.id === id ? data.user : user)))
      setMessage(`Password direset. Kode klaim baru: ${data.user.claimCode}`)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Password pengguna gagal direset.")
    }
  }

  const handleSelectMember = (memberId: string) => {
    const selectedMember = members.find((member) => member.id === memberId)

    setNewUser({
      ...newUser,
      memberId,
      name: selectedMember?.name ?? newUser.name,
      email: selectedMember?.email ?? newUser.email,
    })
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Pengelolaan Pengguna</h1>
          <p className="text-muted-foreground">
            Kelola akun CMS dan hak akses setiap pengurus.
          </p>
        </div>
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Tambah Pengguna
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Tambah Pengguna CMS</DialogTitle>
              <DialogDescription>
                Buat akun yang akan diklaim pengguna menggunakan kode klaim.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="member">Anggota Terkait</Label>
                <Select value={newUser.memberId} onValueChange={handleSelectMember}>
                  <SelectTrigger id="member">
                    <SelectValue placeholder="Pilih member organisasi" />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name} - {member.position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  User CMS wajib terhubung ke data member organisasi.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="Nama lengkap anggota"
                  readOnly={Boolean(newUser.memberId)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Alamat Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="email@himad3si.ac.id"
                  readOnly={Boolean(newUser.memberId)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Peran</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value) => setNewUser({ ...newUser, role: value as User["role"] })}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Pilih peran" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {newUser.role && (
                  <p className="text-xs text-muted-foreground">
                    Masuk group {roleGroupMeta[getRoleGroup(newUser.role as UserRole)].label}
                  </p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddUserOpen(false)} disabled={isSubmitting}>
                Batal
              </Button>
              <Button onClick={handleAddUser} disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Buat Kode Klaim
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {message && (
        <div className="rounded-lg border bg-card px-4 py-3 text-sm">
          {message}
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-primary/10 p-2">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Pengguna</p>
              <p className="text-xl font-bold">{users.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-secondary/80 p-2">
              <Shield className="h-5 w-5 text-secondary-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Administrator</p>
              <p className="text-xl font-bold">{users.filter(u => u.role === "administrator").length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-blue-100 p-2">
              <UserCog className="h-5 w-5 text-blue-700" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pengurus HIMA</p>
              <p className="text-xl font-bold">{users.filter(u => u.role !== "administrator").length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-green-100 p-2">
              <Key className="h-5 w-5 text-green-700" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pengguna Aktif</p>
              <p className="text-xl font-bold">{users.filter(u => u.status === "active").length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Role Permissions Overview */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Object.entries(roleGroupMeta).map(([key, group]) => (
          <Card key={key}>
            <CardHeader className="pb-2">
              <Badge className={group.color}>{group.label}</Badge>
              <CardDescription className="mt-2">{group.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-2 text-xs font-medium text-muted-foreground">Hak akses:</p>
              <div className="flex flex-wrap gap-1">
                {getPermissions(userRoles.find((role) => getRoleGroup(role) === key) ?? "staff").map((perm) => (
                  <Badge key={perm} variant="secondary" className="text-xs">
                    {perm}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle>Semua Pengguna</CardTitle>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Cari pengguna..."
                  className="w-full pl-9 sm:w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Semua peran" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua peran</SelectItem>
                  {roleOptions.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pengguna</TableHead>
                  <TableHead>Peran</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Kode Klaim</TableHead>
                  <TableHead>Login Terakhir</TableHead>
                  <TableHead>Dibuat</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={7} className="h-28 text-center text-muted-foreground">
                      <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
                      Memuat data pengguna...
                    </TableCell>
                  </TableRow>
                )}
                {!isLoading && filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="h-28 text-center text-muted-foreground">
                      {users.length === 0 ? "Belum ada akun CMS." : "Tidak ada pengguna yang sesuai pencarian."}
                    </TableCell>
                  </TableRow>
                )}
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                            {getFirstNameInitial(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={roleGroupMeta[getRoleGroup(user.role)].color}>
                        {roleLabels[user.role]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.status === "active" ? "default" : "secondary"}>
                        {statusLabels[user.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {user.claimCode ?? "-"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{user.lastLogin}</TableCell>
                    <TableCell className="text-muted-foreground">{user.createdAt}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => toggleUserStatus(user.id)}>
                            <Shield className="mr-2 h-4 w-4" />
                            {user.status === "active" ? "Nonaktifkan" : "Aktifkan"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleResetPassword(user.id)}
                            disabled={user.role === "administrator" && users.filter(u => u.role === "administrator" && u.status === "active").length === 1}
                          >
                            <Key className="mr-2 h-4 w-4" />
                            Reset Password
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={user.role === "administrator" && users.filter(u => u.role === "administrator").length === 1}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Nonaktifkan
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
