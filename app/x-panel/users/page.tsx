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
import { Plus, Search, MoreHorizontal, Edit, Trash2, Shield, UserCog, Users, Key } from "lucide-react"
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
  avatar: string
}

interface MemberOption {
  id: string
  name: string
  email: string
  department: string
  position: string
}

const initialUsers: User[] = [
  { id: "user-1", name: "Super Admin", email: "admin@himad3si.ac.id", role: "administrator", status: "active", claimCode: null, lastLogin: "2024-12-14 10:30", createdAt: "2024-01-01", avatar: "" },
  { id: "user-2", name: "Ahmad Rizki", email: "ahmad@himad3si.ac.id", role: "ketua", status: "active", claimCode: null, lastLogin: "2024-12-14 09:15", createdAt: "2024-02-15", avatar: "" },
  { id: "user-3", name: "Siti Nurhaliza", email: "siti@himad3si.ac.id", role: "sekretaris", status: "unclaimed", claimCode: "A1B2C3D4", lastLogin: "-", createdAt: "2024-02-15", avatar: "" },
  { id: "user-4", name: "Budi Santoso", email: "budi@himad3si.ac.id", role: "kepala_departemen", status: "inactive", claimCode: null, lastLogin: "2024-11-20 11:00", createdAt: "2024-03-10", avatar: "" },
  { id: "user-5", name: "Dian Permata", email: "dian@himad3si.ac.id", role: "bendahara", status: "active", claimCode: null, lastLogin: "2024-12-12 16:30", createdAt: "2024-04-01", avatar: "" },
]

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

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [members, setMembers] = useState<MemberOption[]>([])
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

        if (usersResponse.ok) {
          const data = await usersResponse.json()
          setUsers(data.users)
        }

        if (organizationResponse.ok) {
          const data = await organizationResponse.json()
          setMembers(data.members)
        }
      } catch {
        // Keep local fallback data when the backend is unavailable.
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
    if (!newUser.role) return

    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      })

      if (!response.ok) return

      const data = await response.json()
      setUsers([data.user, ...users])
      setNewUser({ memberId: "", name: "", email: "", role: "" })
      setIsAddUserOpen(false)
    } catch {
      // The form stays open so the user can retry.
    }
  }

  const handleDeleteUser = async (id: string) => {
    const previousUsers = users
    setUsers(users.filter(u => u.id !== id))

    try {
      const response = await fetch(`/api/admin/users?id=${id}`, { method: "DELETE" })
      if (!response.ok) {
        setUsers(previousUsers)
      }
    } catch {
      setUsers(previousUsers)
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

      if (!response.ok) {
        setUsers(previousUsers)
        return
      }

      const data = await response.json()
      setUsers((currentUsers) => currentUsers.map((user) => (user.id === id ? data.user : user)))
    } catch {
      setUsers(previousUsers)
    }
  }

  const handleResetPassword = async (id: string) => {
    const previousUsers = users

    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "reset_password" }),
      })

      if (!response.ok) return

      const data = await response.json()
      setUsers((currentUsers) => currentUsers.map((user) => (user.id === id ? data.user : user)))
    } catch {
      setUsers(previousUsers)
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
            Manage admin users and their access permissions.
          </p>
        </div>
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Tambah Pengguna CMS</DialogTitle>
              <DialogDescription>
                Buat akun unclaimed. User akan mengklaim akun memakai claim code.
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
                  placeholder="Enter full name"
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
                    <SelectValue placeholder="Select role" />
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
              <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddUser}>Buat Kode Klaim</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

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
              <p className="mb-2 text-xs font-medium text-muted-foreground">Permissions:</p>
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
                  placeholder="Search users..."
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
                        {user.status}
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
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleUserStatus(user.id)}>
                            <Shield className="mr-2 h-4 w-4" />
                            {user.status === "active" ? "Deactivate" : "Activate"}
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
                            Delete
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
