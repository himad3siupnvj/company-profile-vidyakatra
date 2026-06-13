"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import {
  Building2,
  Edit,
  ImagePlus,
  MoreHorizontal,
  Network,
  Plus,
  Search,
  Trash2,
  Upload,
  Users,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { OrganizationChart } from "@/components/admin/organization-chart"
import { optimizeImageForUpload } from "@/lib/client-image-processing"

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

interface OrganizationalUnit {
  id: string
  name: string
  type: "department" | "bureau"
  description: string
  imageUrl: string
  head: string
  memberCount: number
  color: string
  sortOrder: number
}

interface UnitForm {
  name: string
  type: "department" | "bureau"
  description: string
  color: string
}

const emptyUnitForm: UnitForm = {
  name: "",
  type: "department",
  description: "",
  color: "bg-primary",
}

const unitColors = [
  { value: "bg-primary", label: "Primary", swatch: "bg-primary" },
  { value: "bg-blue-500", label: "Blue", swatch: "bg-blue-500" },
  { value: "bg-emerald-500", label: "Emerald", swatch: "bg-emerald-500" },
  { value: "bg-amber-500", label: "Amber", swatch: "bg-amber-500" },
  { value: "bg-rose-500", label: "Rose", swatch: "bg-rose-500" },
  { value: "bg-violet-500", label: "Violet", swatch: "bg-violet-500" },
] as const

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export default function OrganizationManagement() {
  const [members, setMembers] = useState<Member[]>([])
  const [units, setUnits] = useState<OrganizationalUnit[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterUnit, setFilterUnit] = useState("all")
  const [activeTab, setActiveTab] = useState("members")
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)
  const [isUnitDialogOpen, setIsUnitDialogOpen] = useState(false)
  const [editingUnit, setEditingUnit] = useState<OrganizationalUnit | null>(null)
  const [unitForm, setUnitForm] = useState<UnitForm>(emptyUnitForm)
  const [isSavingUnit, setIsSavingUnit] = useState(false)
  const [deletingUnitId, setDeletingUnitId] = useState<string | null>(null)
  const [isUploadingUnitImages, setIsUploadingUnitImages] = useState(false)
  const [isUploadingMemberImages, setIsUploadingMemberImages] = useState(false)
  const unitImagesInputRef = useRef<HTMLInputElement>(null)
  const memberImagesInputRef = useRef<HTMLInputElement>(null)
  const [newMember, setNewMember] = useState({
    name: "",
    position: "",
    department: "",
    email: "",
  })

  const loadOrganization = async () => {
    setIsLoading(true)
    setErrorMessage("")

    try {
      const response = await fetch("/api/admin/organization")
      if (!response.ok) throw new Error("Failed to load organization data")

      const data = await response.json()
      setMembers(data.members ?? [])
      setUnits(data.organizationalUnits ?? data.departments ?? [])
    } catch {
      setErrorMessage("Data organisasi belum bisa dimuat. Coba refresh halaman.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get("action") === "add") setIsAddMemberOpen(true)
    if (params.get("tab") === "structure") setActiveTab("structure")
    if (params.get("tab") === "units") setActiveTab("units")
    void loadOrganization()
  }, [])

  const filteredMembers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return members.filter((member) => {
      const matchesSearch =
        !query ||
        member.name.toLowerCase().includes(query) ||
        member.position.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query)
      const matchesUnit = filterUnit === "all" || member.department === filterUnit
      return matchesSearch && matchesUnit
    })
  }, [filterUnit, members, searchQuery])

  const handleUnitImagesUpload = async (files: FileList | null) => {
    if (!files?.length) return

    setIsUploadingUnitImages(true)
    setErrorMessage("")
    setSuccessMessage("")

    const formData = new FormData()
    Array.from(files).forEach((file) => formData.append("files", file))

    try {
      const response = await fetch("/api/admin/organization/images", {
        method: "POST",
        body: formData,
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Upload gambar unit gagal.")

      const uploaded = data.uploaded ?? []
      const unmatched = data.unmatched ?? []
      setUnits((current) =>
        current.map((unit) => {
          const result = uploaded.find(
            (item: { unitId: string; url: string }) => item.unitId === unit.id,
          )
          return result ? { ...unit, imageUrl: result.url } : unit
        }),
      )

      if (uploaded.length) {
        setSuccessMessage(`${uploaded.length} gambar unit berhasil dipasang.`)
      }
      if (unmatched.length) {
        setErrorMessage(
          `Belum terpasang: ${unmatched
            .map((item: { fileName: string }) => item.fileName)
            .join(", ")}. Samakan nama file dengan nama unit atau singkatannya.`,
        )
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Upload gambar unit gagal.",
      )
    } finally {
      setIsUploadingUnitImages(false)
      if (unitImagesInputRef.current) unitImagesInputRef.current.value = ""
    }
  }

  const handleMemberImagesUpload = async (files: FileList | null) => {
    if (!files?.length) return

    setIsUploadingMemberImages(true)
    setErrorMessage("")
    setSuccessMessage("")

    try {
      const formData = new FormData()
      const optimizedFiles = await Promise.all(
        Array.from(files).map((file) =>
          optimizeImageForUpload(file, {
            maxWidth: 900,
            maxHeight: 1200,
            quality: 0.82,
          }),
        ),
      )
      optimizedFiles.forEach((file) => formData.append("files", file))

      const response = await fetch("/api/admin/organization/member-images", {
        method: "POST",
        body: formData,
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Upload foto anggota gagal.")

      const uploaded = data.uploaded ?? []
      const unmatched = data.unmatched ?? []
      setMembers((current) =>
        current.map((member) => {
          const result = uploaded.find(
            (item: { memberId: string; url: string }) => item.memberId === member.id,
          )
          return result ? { ...member, avatar: result.url } : member
        }),
      )

      if (uploaded.length) {
        setSuccessMessage(`${uploaded.length} foto anggota berhasil dipasang.`)
      }
      if (unmatched.length) {
        setErrorMessage(
          `Belum terpasang: ${unmatched
            .map((item: { fileName: string }) => item.fileName)
            .join(", ")}. Gunakan nama lengkap anggota sebagai nama file.`,
        )
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Upload foto anggota gagal.",
      )
    } finally {
      setIsUploadingMemberImages(false)
      if (memberImagesInputRef.current) memberImagesInputRef.current.value = ""
    }
  }

  const handleAddMember = async () => {
    setErrorMessage("")

    try {
      const response = await fetch("/api/admin/organization", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "member", ...newMember }),
      })

      if (!response.ok) throw new Error("Failed to add member")

      const data = await response.json()
      setMembers((current) => [...current, data.member])
      setNewMember({ name: "", position: "", department: "", email: "" })
      setIsAddMemberOpen(false)
    } catch {
      setErrorMessage("Anggota belum berhasil ditambahkan. Periksa kembali datanya.")
    }
  }

  const handleDeleteMember = async (id: string) => {
    const previousMembers = members
    setMembers((current) => current.filter((member) => member.id !== id))

    try {
      const response = await fetch(`/api/admin/organization?id=${id}&type=member`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete member")
    } catch {
      setMembers(previousMembers)
      setErrorMessage("Anggota belum berhasil dihapus.")
    }
  }

  const openCreateUnit = () => {
    setEditingUnit(null)
    setUnitForm(emptyUnitForm)
    setIsUnitDialogOpen(true)
  }

  const openEditUnit = (unit: OrganizationalUnit) => {
    setEditingUnit(unit)
    setUnitForm({
      name: unit.name,
      type: unit.type,
      description: unit.description,
      color: unit.color,
    })
    setIsUnitDialogOpen(true)
  }

  const handleSaveUnit = async () => {
    if (!unitForm.name.trim()) {
      setErrorMessage("Nama departemen atau biro wajib diisi.")
      return
    }

    setIsSavingUnit(true)
    setErrorMessage("")

    try {
      const response = await fetch("/api/admin/organization", {
        method: editingUnit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "organizational-unit",
          id: editingUnit?.id,
          name: unitForm.name,
          unitType: unitForm.type,
          description: unitForm.description,
          color: unitForm.color,
          sortOrder: editingUnit?.sortOrder ?? units.length,
        }),
      })

      if (!response.ok) throw new Error("Failed to save organizational unit")

      const data = await response.json()
      const savedUnit = data.organizationalUnit as OrganizationalUnit
      setUnits((current) =>
        editingUnit
          ? current.map((unit) => (unit.id === savedUnit.id ? { ...unit, ...savedUnit } : unit))
          : [...current, savedUnit],
      )
      setIsUnitDialogOpen(false)
      setEditingUnit(null)
      setUnitForm(emptyUnitForm)
    } catch {
      setErrorMessage("Departemen atau biro belum berhasil disimpan.")
    } finally {
      setIsSavingUnit(false)
    }
  }

  const handleDeleteUnit = async (unit: OrganizationalUnit) => {
    const confirmed = window.confirm(
      `Hapus ${unit.type === "bureau" ? "biro" : "departemen"} ${unit.name}? Anggota di dalamnya akan menjadi unassigned.`,
    )
    if (!confirmed) return

    setDeletingUnitId(unit.id)
    setErrorMessage("")

    try {
      const response = await fetch(
        `/api/admin/organization?id=${unit.id}&type=organizational-unit`,
        { method: "DELETE" },
      )
      if (!response.ok) throw new Error("Failed to delete organizational unit")

      setUnits((current) => current.filter((item) => item.id !== unit.id))
      setMembers((current) =>
        current.map((member) =>
          member.department === unit.name ? { ...member, department: "Unassigned" } : member,
        ),
      )
      if (filterUnit === unit.name) setFilterUnit("all")
    } catch {
      setErrorMessage("Departemen atau biro belum berhasil dihapus.")
    } finally {
      setDeletingUnitId(null)
    }
  }

  const departmentCount = units.filter((unit) => unit.type === "department").length
  const bureauCount = units.filter((unit) => unit.type === "bureau").length

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Pengelolaan Organisasi</h1>
          <p className="text-muted-foreground">
            Kelola pengurus, departemen, biro, dan struktur organisasi Kabinet Vidyakatra.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            ref={unitImagesInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            className="hidden"
            onChange={(event) => void handleUnitImagesUpload(event.target.files)}
          />
          <input
            ref={memberImagesInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={(event) => void handleMemberImagesUpload(event.target.files)}
          />
          <Button
            variant="outline"
            className="gap-2"
            disabled={isUploadingMemberImages || members.length === 0}
            onClick={() => memberImagesInputRef.current?.click()}
          >
            <ImagePlus className="h-4 w-4" />
            {isUploadingMemberImages ? "Uploading..." : "Upload Foto Anggota"}
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            disabled={isUploadingUnitImages || units.length === 0}
            onClick={() => unitImagesInputRef.current?.click()}
          >
            <Upload className="h-4 w-4" />
            {isUploadingUnitImages ? "Uploading..." : "Upload Gambar Unit"}
          </Button>
          <Button variant="outline" className="gap-2" onClick={openCreateUnit}>
            <Building2 className="h-4 w-4" />
            Add Department
          </Button>
          <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Member
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Tambah Anggota</DialogTitle>
                <DialogDescription>Add a new member to the organization.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-dashed border-border bg-muted">
                      <ImagePlus className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                      aria-label="Add member photo"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input
                    id="name"
                    value={newMember.name}
                    onChange={(event) => setNewMember({ ...newMember, name: event.target.value })}
                    placeholder="Enter full name"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="position">Jabatan</Label>
                    <Input
                      id="position"
                      value={newMember.position}
                      onChange={(event) =>
                        setNewMember({ ...newMember, position: event.target.value })
                      }
                      placeholder="e.g., Staff"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="member-unit">Departemen / Biro</Label>
                    <Select
                      value={newMember.department}
                      onValueChange={(value) => setNewMember({ ...newMember, department: value })}
                    >
                      <SelectTrigger id="member-unit">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        {units.map((unit) => (
                          <SelectItem key={unit.id} value={unit.name}>
                            {unit.name}
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
                    onChange={(event) => setNewMember({ ...newMember, email: event.target.value })}
                    placeholder="email@example.com"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddMemberOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddMember}>Tambah Anggota</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {errorMessage && (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div className="rounded-md border border-emerald-500/30 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-600">
          {successMessage}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-md bg-primary/10 p-3">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Anggota</p>
              <p className="text-2xl font-bold">{members.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-md bg-blue-500/10 p-3">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Departemen</p>
              <p className="text-2xl font-bold">{departmentCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-md bg-amber-500/10 p-3">
              <Building2 className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Biro</p>
              <p className="text-2xl font-bold">{bureauCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-md bg-emerald-500/10 p-3">
              <Network className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Anggota Aktif</p>
              <p className="text-2xl font-bold">
                {members.filter((member) => member.status === "active").length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="members">Anggota</TabsTrigger>
          <TabsTrigger value="units">Departemen & Biro</TabsTrigger>
          <TabsTrigger value="structure">Struktur Organisasi</TabsTrigger>
        </TabsList>

        <TabsContent value="members">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <CardTitle>Semua Anggota</CardTitle>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Cari anggota..."
                      className="w-full pl-9 sm:w-64"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                    />
                  </div>
                  <Select value={filterUnit} onValueChange={setFilterUnit}>
                    <SelectTrigger className="w-full sm:w-52">
                      <SelectValue placeholder="Semua unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua unit</SelectItem>
                      {units.map((unit) => (
                        <SelectItem key={unit.id} value={unit.name}>
                          {unit.name}
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
                      <TableHead>Anggota</TableHead>
                      <TableHead>Jabatan</TableHead>
                      <TableHead>Departemen / Biro</TableHead>
                      <TableHead>Kontak</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-12" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={member.avatar} />
                              <AvatarFallback className="bg-secondary text-xs text-secondary-foreground">
                                {getInitials(member.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{member.name}</p>
                              <p className="text-xs text-muted-foreground">
                                Joined{" "}
                                {new Date(member.joinDate).toLocaleDateString("id-ID", {
                                  month: "short",
                                  year: "numeric",
                                })}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{member.position}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{member.department}</Badge>
                        </TableCell>
                        <TableCell>{member.email || "-"}</TableCell>
                        <TableCell>
                          <Badge variant={member.status === "active" ? "default" : "secondary"}>
                            {member.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" aria-label={`Actions for ${member.name}`}>
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
                    {!isLoading && filteredMembers.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                          Anggota tidak ditemukan.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="units" className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Departemen & Biro</h2>
              <p className="text-sm text-muted-foreground">
                Unit yang tampil di profil publik. Untuk gambar unit, gunakan nama file
                sesuai nama unit atau singkatannya, misalnya medkom.png, psdm.jpg, atau
                sosial-politik.webp.
              </p>
            </div>
            <Button size="sm" className="gap-2" onClick={openCreateUnit}>
              <Plus className="h-4 w-4" />
              Add Unit
            </Button>
          </div>

          {units.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {units.map((unit) => (
                <Card key={unit.id} className="overflow-hidden">
                  {unit.imageUrl && (
                    <div className="flex h-36 items-center justify-center border-b bg-muted/30 p-5">
                      <Image
                        src={unit.imageUrl}
                        alt={`Gambar ${unit.name}`}
                        width={240}
                        height={144}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  )}
                  <div className={`h-1.5 ${unit.color}`} />
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="mb-2 flex items-center gap-2">
                          <Badge variant="outline">
                            {unit.type === "bureau" ? "Bureau" : "Department"}
                          </Badge>
                          <Badge variant="secondary">{unit.memberCount} anggota</Badge>
                        </div>
                        <CardTitle className="text-base">{unit.name}</CardTitle>
                        <CardDescription className="mt-1 line-clamp-2 min-h-10">
                          {unit.description || "No description yet."}
                        </CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" aria-label={`Actions for ${unit.name}`}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditUnit(unit)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            disabled={deletingUnitId === unit.id}
                            onClick={() => handleDeleteUnit(unit)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="border-t pt-4">
                    <p className="text-xs font-medium uppercase text-muted-foreground">Kepala Unit</p>
                    <div className="mt-2 flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="text-xs">
                          {unit.head === "-" ? "?" : getInitials(unit.head)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">
                        {unit.head === "-" ? "Not assigned" : unit.head}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex min-h-64 flex-col items-center justify-center rounded-md border border-dashed px-6 text-center">
              <Building2 className="mb-4 h-10 w-10 text-muted-foreground" />
              <h3 className="font-semibold">Belum ada departemen atau biro</h3>
              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                Tambahkan unit pertama agar anggota dapat ditempatkan dan bagan organisasi bisa dibuat.
              </p>
              <Button className="mt-4 gap-2" onClick={openCreateUnit}>
                <Plus className="h-4 w-4" />
                Add Unit
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="structure">
          <Card>
            <CardHeader>
              <CardTitle>Bagan Organisasi</CardTitle>
              <CardDescription>
                Struktur ini otomatis mengikuti jabatan anggota dan unit organisasi.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {members.length === 0 && units.length === 0 ? (
                <div className="flex min-h-64 flex-col items-center justify-center text-center">
                  <Network className="mb-4 h-10 w-10 text-muted-foreground" />
                  <h3 className="font-semibold">Bagan organisasi masih kosong</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Tambahkan departemen, biro, dan anggota untuk membuat bagan organisasi.
                  </p>
                </div>
              ) : (
                <OrganizationChart members={members} units={units} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isUnitDialogOpen} onOpenChange={setIsUnitDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingUnit ? "Edit Organizational Unit" : "Add Organizational Unit"}</DialogTitle>
            <DialogDescription>
              Create a department or bureau for member assignment and the public profile.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="unit-name">Nama Unit</Label>
              <Input
                id="unit-name"
                value={unitForm.name}
                onChange={(event) => setUnitForm({ ...unitForm, name: event.target.value })}
                placeholder="e.g., Media and Information"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit-type">Jenis Unit</Label>
              <Select
                value={unitForm.type}
                onValueChange={(value: "department" | "bureau") =>
                  setUnitForm({ ...unitForm, type: value })
                }
              >
                <SelectTrigger id="unit-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="department">Departemen</SelectItem>
                  <SelectItem value="bureau">Biro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit-description">Deskripsi</Label>
              <Textarea
                id="unit-description"
                rows={4}
                value={unitForm.description}
                onChange={(event) =>
                  setUnitForm({ ...unitForm, description: event.target.value })
                }
                placeholder="Brief responsibility of this unit"
              />
            </div>
            <div className="space-y-2">
              <Label>Warna Bagan</Label>
              <div className="flex flex-wrap gap-2">
                {unitColors.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    className={`flex h-9 items-center gap-2 rounded-md border px-3 text-sm ${
                      unitForm.color === color.value ? "border-foreground" : "border-border"
                    }`}
                    onClick={() => setUnitForm({ ...unitForm, color: color.value })}
                  >
                    <span className={`h-3 w-3 rounded-full ${color.swatch}`} />
                    {color.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUnitDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveUnit} disabled={isSavingUnit}>
              {isSavingUnit ? "Saving..." : editingUnit ? "Save Changes" : "Add Unit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
