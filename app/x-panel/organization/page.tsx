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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, MoreHorizontal, Edit, Trash2, ImagePlus, Users, Network, Building2 } from "lucide-react"

interface Member {
  id: string
  name: string
  position: string
  department: string
  email: string
  avatar: string
  status: "active" | "inactive"
  joinDate: string
}

interface Department {
  id: string
  name: string
  description: string
  head: string
  memberCount: number
  color: string
}

const initialMembers: Member[] = [
  { id: "member-1", name: "Ahmad Rizki Pratama", position: "Ketua Umum", department: "Executive", email: "ahmad@email.com", avatar: "", status: "active", joinDate: "2024-01-15" },
  { id: "member-2", name: "Siti Nurhaliza", position: "Wakil Ketua", department: "Executive", email: "siti@email.com", avatar: "", status: "active", joinDate: "2024-01-15" },
  { id: "member-3", name: "Budi Santoso", position: "Sekretaris", department: "Executive", email: "budi@email.com", avatar: "", status: "active", joinDate: "2024-01-15" },
  { id: "member-4", name: "Dian Permata", position: "Bendahara", department: "Executive", email: "dian@email.com", avatar: "", status: "active", joinDate: "2024-01-15" },
  { id: "member-5", name: "Reza Firmansyah", position: "Koordinator", department: "Media & Informasi", email: "reza@email.com", avatar: "", status: "active", joinDate: "2024-02-01" },
  { id: "member-6", name: "Maya Indah", position: "Staff", department: "Media & Informasi", email: "maya@email.com", avatar: "", status: "active", joinDate: "2024-02-15" },
  { id: "member-7", name: "Andi Wijaya", position: "Koordinator", department: "Pendidikan", email: "andi@email.com", avatar: "", status: "active", joinDate: "2024-02-01" },
  { id: "member-8", name: "Lisa Kurnia", position: "Staff", department: "Kewirausahaan", email: "lisa@email.com", avatar: "", status: "inactive", joinDate: "2024-03-01" },
]

const initialDepartments: Department[] = [
  { id: "department-1", name: "Executive", description: "Badan Pengurus Harian", head: "Ahmad Rizki Pratama", memberCount: 4, color: "bg-primary" },
  { id: "department-2", name: "Media & Informasi", description: "Divisi publikasi dan media sosial", head: "Reza Firmansyah", memberCount: 8, color: "bg-blue-500" },
  { id: "department-3", name: "Pendidikan", description: "Divisi pendidikan dan pelatihan", head: "Andi Wijaya", memberCount: 12, color: "bg-green-500" },
  { id: "department-4", name: "Kewirausahaan", description: "Divisi bisnis dan kewirausahaan", head: "Lisa Kurnia", memberCount: 10, color: "bg-orange-500" },
  { id: "department-5", name: "Hubungan Masyarakat", description: "Divisi humas dan kerjasama", head: "Dewi Sartika", memberCount: 6, color: "bg-purple-500" },
  { id: "department-6", name: "Kesejahteraan", description: "Divisi kesejahteraan mahasiswa", head: "Fajar Nugroho", memberCount: 8, color: "bg-pink-500" },
  { id: "department-7", name: "Olahraga & Seni", description: "Divisi olahraga dan kesenian", head: "Galih Pratama", memberCount: 14, color: "bg-cyan-500" },
  { id: "department-8", name: "Kerohanian", description: "Divisi keagamaan", head: "Hana Pertiwi", memberCount: 6, color: "bg-emerald-500" },
]

export default function OrganizationManagement() {
  const [members, setMembers] = useState<Member[]>(initialMembers)
  const [departments, setDepartments] = useState<Department[]>(initialDepartments)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterDepartment, setFilterDepartment] = useState<string>("all")
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)
  const [newMember, setNewMember] = useState({
    name: "",
    position: "",
    department: "",
    email: "",
  })

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get("action") === "add") {
      setIsAddMemberOpen(true)
    }
  }, [])

  useEffect(() => {
    async function loadOrganization() {
      try {
        const response = await fetch("/api/admin/organization")
        if (!response.ok) return

        const data = await response.json()
        setMembers(data.members)
        setDepartments(data.departments)
      } catch {
        // Keep local fallback data when the backend is unavailable.
      }
    }

    loadOrganization()
  }, [])

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDepartment = filterDepartment === "all" || member.department === filterDepartment
    return matchesSearch && matchesDepartment
  })

  const handleAddMember = async () => {
    try {
      const response = await fetch("/api/admin/organization", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "member", ...newMember }),
      })

      if (!response.ok) return

      const data = await response.json()
      setMembers([...members, data.member])
      setNewMember({ name: "", position: "", department: "", email: "" })
      setIsAddMemberOpen(false)
    } catch {
      // The form stays open so the user can retry.
    }
  }

  const handleDeleteMember = async (id: string) => {
    const previousMembers = members
    setMembers(members.filter(m => m.id !== id))

    try {
      const response = await fetch(`/api/admin/organization?id=${id}`, { method: "DELETE" })
      if (!response.ok) {
        setMembers(previousMembers)
      }
    } catch {
      setMembers(previousMembers)
    }
  }

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Organization Management</h1>
          <p className="text-muted-foreground">
            Kelola pengurus, departemen, dan struktur organisasi Kabinet Vidyakatra.
          </p>
        </div>
        <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Member</DialogTitle>
              <DialogDescription>
                Add a new member to the organization.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-dashed border-border bg-muted">
                    <ImagePlus className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <Button size="sm" variant="secondary" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    value={newMember.position}
                    onChange={(e) => setNewMember({ ...newMember, position: e.target.value })}
                    placeholder="e.g., Staff"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={newMember.department}
                    onValueChange={(value) => setNewMember({ ...newMember, department: value })}
                  >
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.name}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddMemberOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddMember}>Add Member</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-lg bg-primary/10 p-3">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Members</p>
              <p className="text-2xl font-bold">{members.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-lg bg-secondary/80 p-3">
              <Building2 className="h-6 w-6 text-secondary-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Departments</p>
              <p className="text-2xl font-bold">{departments.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-lg bg-green-100 p-3">
              <Network className="h-6 w-6 text-green-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Members</p>
              <p className="text-2xl font-bold">{members.filter(m => m.status === "active").length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="members" className="space-y-4">
        <TabsList>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="structure">Org Structure</TabsTrigger>
        </TabsList>

        {/* Members Tab */}
        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <CardTitle>All Members</CardTitle>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search members..."
                      className="w-full pl-9 sm:w-64"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.name}>
                          {dept.name}
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
                      <TableHead>Member</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={member.avatar} />
                              <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                                {getInitials(member.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{member.name}</p>
                              <p className="text-xs text-muted-foreground">
                                Joined {new Date(member.joinDate).toLocaleDateString("id-ID", { month: "short", year: "numeric" })}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{member.position}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{member.department}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{member.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={member.status === "active" ? "default" : "secondary"}>
                            {member.status}
                          </Badge>
                        </TableCell>
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
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDeleteMember(member.id)}
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
        </TabsContent>

        {/* Departments Tab */}
        <TabsContent value="departments" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {departments.map((dept) => (
              <Card key={dept.id} className="overflow-hidden">
                <div className={`h-2 ${dept.color}`} />
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{dept.name}</CardTitle>
                  <CardDescription>{dept.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Head:</span>
                      <span className="font-medium">{dept.head}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Members:</span>
                      <Badge variant="secondary">{dept.memberCount}</Badge>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="mt-4 w-full">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Org Structure Tab */}
        <TabsContent value="structure" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Organization Chart</CardTitle>
              <CardDescription>
                Visual representation of the organization hierarchy.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                {/* Ketua Umum */}
                <div className="flex flex-col items-center">
                  <Card className="w-48 border-2 border-primary">
                    <CardContent className="p-4 text-center">
                      <Avatar className="mx-auto h-12 w-12">
                        <AvatarFallback className="bg-primary text-primary-foreground">AR</AvatarFallback>
                      </Avatar>
                      <p className="mt-2 font-semibold">Ahmad Rizki P.</p>
                      <p className="text-xs text-muted-foreground">Ketua Umum</p>
                    </CardContent>
                  </Card>
                  <div className="h-8 w-0.5 bg-border" />
                </div>

                {/* BPH Row */}
                <div className="flex gap-4">
                  {[
                    { name: "Siti N.", role: "Wakil Ketua", initials: "SN" },
                    { name: "Budi S.", role: "Sekretaris", initials: "BS" },
                    { name: "Dian P.", role: "Bendahara", initials: "DP" },
                  ].map((member) => (
                    <div key={member.name} className="flex flex-col items-center">
                      <div className="h-8 w-0.5 bg-border" />
                      <Card className="w-40">
                        <CardContent className="p-3 text-center">
                          <Avatar className="mx-auto h-10 w-10">
                            <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                              {member.initials}
                            </AvatarFallback>
                          </Avatar>
                          <p className="mt-2 text-sm font-medium">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.role}</p>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>

                {/* Departments Row */}
                <div className="mt-8 w-full">
                  <div className="mx-auto h-0.5 w-3/4 bg-border" />
                  <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-8">
                    {departments.slice(1).map((dept) => (
                      <Card key={dept.id} className="text-center">
                        <CardContent className="p-3">
                          <div className={`mx-auto mb-2 h-8 w-8 rounded-full ${dept.color}`} />
                          <p className="text-xs font-medium leading-tight">{dept.name}</p>
                          <p className="text-xs text-muted-foreground">{dept.memberCount} members</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
