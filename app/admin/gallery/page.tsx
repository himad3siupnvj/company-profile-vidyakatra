"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import {
  Plus,
  Search,
  MoreHorizontal,
  Trash2,
  Upload,
  FolderPlus,
  Image as ImageIcon,
  Grid3X3,
  LayoutList,
  Download,
  Eye,
  X,
  CheckCircle2,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface MediaItem {
  id: number
  name: string
  url: string
  type: "image" | "video"
  size: string
  uploadedAt: string
  albumId: number
}

interface Album {
  id: number
  name: string
  description: string
  coverImage: string
  itemCount: number
  createdAt: string
}

const initialAlbums: Album[] = [
  { id: 1, name: "Seminar IT 2024", description: "Dokumentasi acara Seminar IT 2024", coverImage: "/gallery/seminar-cover.jpg", itemCount: 24, createdAt: "2024-12-10" },
  { id: 2, name: "Workshop Web Development", description: "Kegiatan workshop pemrograman web", coverImage: "/gallery/workshop-cover.jpg", itemCount: 18, createdAt: "2024-12-05" },
  { id: 3, name: "Gathering Tahunan 2024", description: "Momen kebersamaan anggota HIMA", coverImage: "/gallery/gathering-cover.jpg", itemCount: 45, createdAt: "2024-11-15" },
  { id: 4, name: "Kepengurusan 2024", description: "Foto resmi pengurus HIMA D3 SI", coverImage: "/gallery/pengurus-cover.jpg", itemCount: 12, createdAt: "2024-01-20" },
  { id: 5, name: "Tech Talk Series", description: "Sesi diskusi teknologi bulanan", coverImage: "/gallery/techtalk-cover.jpg", itemCount: 30, createdAt: "2024-10-08" },
]

const initialMedia: MediaItem[] = [
  { id: 1, name: "seminar-opening.jpg", url: "/gallery/1.jpg", type: "image", size: "2.4 MB", uploadedAt: "2024-12-10", albumId: 1 },
  { id: 2, name: "seminar-speaker.jpg", url: "/gallery/2.jpg", type: "image", size: "1.8 MB", uploadedAt: "2024-12-10", albumId: 1 },
  { id: 3, name: "seminar-audience.jpg", url: "/gallery/3.jpg", type: "image", size: "3.1 MB", uploadedAt: "2024-12-10", albumId: 1 },
  { id: 4, name: "workshop-coding.jpg", url: "/gallery/4.jpg", type: "image", size: "2.2 MB", uploadedAt: "2024-12-05", albumId: 2 },
  { id: 5, name: "workshop-team.jpg", url: "/gallery/5.jpg", type: "image", size: "1.9 MB", uploadedAt: "2024-12-05", albumId: 2 },
  { id: 6, name: "gathering-group.jpg", url: "/gallery/6.jpg", type: "image", size: "4.5 MB", uploadedAt: "2024-11-15", albumId: 3 },
  { id: 7, name: "gathering-games.jpg", url: "/gallery/7.jpg", type: "image", size: "2.8 MB", uploadedAt: "2024-11-15", albumId: 3 },
  { id: 8, name: "pengurus-formal.jpg", url: "/gallery/8.jpg", type: "image", size: "3.2 MB", uploadedAt: "2024-01-20", albumId: 4 },
]

export default function GalleryManagement() {
  const [albums, setAlbums] = useState<Album[]>(initialAlbums)
  const [media, setMedia] = useState<MediaItem[]>(initialMedia)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAlbum, setSelectedAlbum] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [isCreateAlbumOpen, setIsCreateAlbumOpen] = useState(false)
  const [selectedImages, setSelectedImages] = useState<number[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [newAlbum, setNewAlbum] = useState({ name: "", description: "" })
  const [uploadAlbum, setUploadAlbum] = useState("")

  const filteredMedia = media.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesAlbum = selectedAlbum === "all" || item.albumId === parseInt(selectedAlbum)
    return matchesSearch && matchesAlbum
  })

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    // Handle file drop - in real app, this would upload files
    const files = Array.from(e.dataTransfer.files)
    console.log("Dropped files:", files)
  }, [])

  const toggleImageSelection = (id: number) => {
    setSelectedImages(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const handleCreateAlbum = () => {
    const id = Math.max(...albums.map(a => a.id), 0) + 1
    setAlbums([...albums, {
      id,
      name: newAlbum.name,
      description: newAlbum.description,
      coverImage: "/gallery/default-cover.jpg",
      itemCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
    }])
    setNewAlbum({ name: "", description: "" })
    setIsCreateAlbumOpen(false)
  }

  const handleDeleteAlbum = (id: number) => {
    setAlbums(albums.filter(a => a.id !== id))
    setMedia(media.filter(m => m.albumId !== id))
  }

  const handleDeleteMedia = (id: number) => {
    setMedia(media.filter(m => m.id !== id))
  }

  const handleDeleteSelected = () => {
    setMedia(media.filter(m => !selectedImages.includes(m.id)))
    setSelectedImages([])
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Media Gallery</h1>
          <p className="text-muted-foreground">
            Manage images and media files for your website.
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCreateAlbumOpen} onOpenChange={setIsCreateAlbumOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <FolderPlus className="h-4 w-4" />
                New Album
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Album</DialogTitle>
                <DialogDescription>
                  Create a new album to organize your media files.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="album-name">Album Name</Label>
                  <Input
                    id="album-name"
                    value={newAlbum.name}
                    onChange={(e) => setNewAlbum({ ...newAlbum, name: e.target.value })}
                    placeholder="Enter album name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="album-description">Description</Label>
                  <Input
                    id="album-description"
                    value={newAlbum.description}
                    onChange={(e) => setNewAlbum({ ...newAlbum, description: e.target.value })}
                    placeholder="Brief description"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateAlbumOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateAlbum}>Create Album</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Upload className="h-4 w-4" />
                Upload
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Upload Media</DialogTitle>
                <DialogDescription>
                  Upload images to your media gallery.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="upload-album">Select Album</Label>
                  <Select value={uploadAlbum} onValueChange={setUploadAlbum}>
                    <SelectTrigger id="upload-album">
                      <SelectValue placeholder="Choose an album" />
                    </SelectTrigger>
                    <SelectContent>
                      {albums.map((album) => (
                        <SelectItem key={album.id} value={album.id.toString()}>
                          {album.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={cn(
                    "flex h-48 flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors",
                    isDragging
                      ? "border-primary bg-primary/5"
                      : "border-border bg-muted/30 hover:bg-muted/50"
                  )}
                >
                  <Upload className="h-10 w-10 text-muted-foreground" />
                  <p className="mt-2 text-sm font-medium">Drag and drop files here</p>
                  <p className="text-xs text-muted-foreground">or click to browse</p>
                  <Button variant="outline" size="sm" className="mt-4">
                    Browse Files
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Supported formats: JPG, PNG, GIF, WebP. Max file size: 5MB
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsUploadOpen(false)}>
                  Cancel
                </Button>
                <Button>Upload Files</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-primary/10 p-2">
              <FolderPlus className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Albums</p>
              <p className="text-xl font-bold">{albums.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-blue-100 p-2">
              <ImageIcon className="h-5 w-5 text-blue-700" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Images</p>
              <p className="text-xl font-bold">{media.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-green-100 p-2">
              <CheckCircle2 className="h-5 w-5 text-green-700" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Selected</p>
              <p className="text-xl font-bold">{selectedImages.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <TabsList>
            <TabsTrigger value="all">All Media</TabsTrigger>
            <TabsTrigger value="albums">Albums</TabsTrigger>
          </TabsList>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                className="w-full pl-9 sm:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedAlbum} onValueChange={setSelectedAlbum}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Albums" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Albums</SelectItem>
                {albums.map((album) => (
                  <SelectItem key={album.id} value={album.id.toString()}>
                    {album.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex rounded-lg border">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <LayoutList className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Selection Actions */}
        {selectedImages.length > 0 && (
          <Card className="border-primary bg-primary/5">
            <CardContent className="flex items-center justify-between p-4">
              <p className="text-sm font-medium">
                {selectedImages.length} item(s) selected
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="gap-2"
                  onClick={handleDeleteSelected}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedImages([])}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* All Media Tab */}
        <TabsContent value="all" className="space-y-4">
          {viewMode === "grid" ? (
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
              {filteredMedia.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "group relative aspect-square cursor-pointer overflow-hidden rounded-lg border bg-muted",
                    selectedImages.includes(item.id) && "ring-2 ring-primary"
                  )}
                  onClick={() => toggleImageSelection(item.id)}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/40" />
                  <div className="absolute left-2 top-2">
                    <div
                      className={cn(
                        "flex h-5 w-5 items-center justify-center rounded border-2 transition-colors",
                        selectedImages.includes(item.id)
                          ? "border-primary bg-primary"
                          : "border-white bg-white/50 opacity-0 group-hover:opacity-100"
                      )}
                    >
                      {selectedImages.includes(item.id) && (
                        <CheckCircle2 className="h-4 w-4 text-white" />
                      )}
                    </div>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <p className="truncate text-xs text-white">{item.name}</p>
                    <p className="text-xs text-white/70">{item.size}</p>
                  </div>
                  <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="secondary" size="icon" className="h-7 w-7">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteMedia(item.id)
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {filteredMedia.map((item) => (
                    <div
                      key={item.id}
                      className={cn(
                        "flex items-center gap-4 p-4 hover:bg-muted/50",
                        selectedImages.includes(item.id) && "bg-primary/5"
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={selectedImages.includes(item.id)}
                        onChange={() => toggleImageSelection(item.id)}
                        className="h-4 w-4 rounded border-input"
                      />
                      <div className="flex h-12 w-12 items-center justify-center rounded bg-muted">
                        <ImageIcon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {albums.find(a => a.id === item.albumId)?.name}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.size}</p>
                      <p className="text-sm text-muted-foreground">{item.uploadedAt}</p>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDeleteMedia(item.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Albums Tab */}
        <TabsContent value="albums" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {albums.map((album) => (
              <Card key={album.id} className="group overflow-hidden">
                <div className="relative aspect-video bg-muted">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Album
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDeleteAlbum(album.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Album
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{album.name}</CardTitle>
                  <CardDescription className="line-clamp-1">{album.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{album.itemCount} items</Badge>
                    <span className="text-xs text-muted-foreground">{album.createdAt}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
