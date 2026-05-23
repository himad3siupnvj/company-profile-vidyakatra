"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  ImagePlus,
  Calendar,
  Clock,
  MapPin,
  Eye,
  FileText,
  Send,
  Archive,
} from "lucide-react"

interface Article {
  id: number
  title: string
  excerpt: string
  category: string
  status: "draft" | "published" | "archived"
  author: string
  publishedAt: string | null
  createdAt: string
  thumbnail: string
  views: number
}

interface Event {
  id: number
  title: string
  description: string
  date: string
  time: string
  location: string
  category: string
  status: "upcoming" | "ongoing" | "completed" | "cancelled"
  registrations: number
  maxParticipants: number
}

const initialArticles: Article[] = [
  { id: 1, title: "Seminar IT 2024: Menghadapi Era Digital", excerpt: "Seminar teknologi informasi dengan pembicara dari berbagai industri teknologi...", category: "Event", status: "published", author: "Ahmad Rizki", publishedAt: "2024-12-10", createdAt: "2024-12-08", thumbnail: "/news/seminar.jpg", views: 245 },
  { id: 2, title: "Workshop Web Development dengan React", excerpt: "Pelajari dasar-dasar React dan bangun aplikasi web modern...", category: "Workshop", status: "published", author: "Maya Indah", publishedAt: "2024-12-05", createdAt: "2024-12-03", thumbnail: "/news/workshop.jpg", views: 189 },
  { id: 3, title: "Pengumuman Pendaftaran Anggota Baru", excerpt: "HIMA D3 SI membuka pendaftaran anggota baru periode 2024/2025...", category: "Announcement", status: "published", author: "Siti Nurhaliza", publishedAt: "2024-12-01", createdAt: "2024-11-28", thumbnail: "/news/recruitment.jpg", views: 567 },
  { id: 4, title: "Tips Sukses Menghadapi Semester Baru", excerpt: "Berikut adalah tips dan trik untuk memulai semester baru dengan baik...", category: "Article", status: "draft", author: "Budi Santoso", publishedAt: null, createdAt: "2024-12-12", thumbnail: "/news/tips.jpg", views: 0 },
  { id: 5, title: "Recap: Gathering Tahunan 2024", excerpt: "Momen-momen seru dari gathering tahunan HIMA D3 SI...", category: "Event", status: "archived", author: "Dian Permata", publishedAt: "2024-11-20", createdAt: "2024-11-18", thumbnail: "/news/gathering.jpg", views: 312 },
]

const initialEvents: Event[] = [
  { id: 1, title: "Seminar IT 2024", description: "Seminar teknologi informasi dengan tema transformasi digital", date: "2024-12-15", time: "09:00", location: "Auditorium Utama", category: "Seminar", status: "upcoming", registrations: 145, maxParticipants: 200 },
  { id: 2, title: "Workshop Web Development", description: "Workshop praktis membangun website dengan React dan Next.js", date: "2024-12-20", time: "13:00", location: "Lab Komputer A", category: "Workshop", status: "upcoming", registrations: 28, maxParticipants: 30 },
  { id: 3, title: "Annual Meeting 2024", description: "Rapat tahunan anggota HIMA D3 SI", date: "2024-12-28", time: "10:00", location: "Ruang Rapat Jurusan", category: "Meeting", status: "upcoming", registrations: 50, maxParticipants: 60 },
  { id: 4, title: "Tech Talk: AI & Machine Learning", description: "Diskusi tentang perkembangan AI dan ML", date: "2024-12-10", time: "14:00", location: "Online (Zoom)", category: "Tech Talk", status: "ongoing", registrations: 89, maxParticipants: 100 },
  { id: 5, title: "Gathering Tahunan", description: "Acara kebersamaan anggota HIMA D3 SI", date: "2024-11-15", time: "08:00", location: "Taman Kampus", category: "Social", status: "completed", registrations: 120, maxParticipants: 150 },
]

const categories = ["Event", "Workshop", "Announcement", "Article", "Tech Talk"]

export default function NewsEventsManagement() {
  const [articles, setArticles] = useState<Article[]>(initialArticles)
  const [events, setEvents] = useState<Event[]>(initialEvents)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [isCreateArticleOpen, setIsCreateArticleOpen] = useState(false)
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false)
  const [newArticle, setNewArticle] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
  })
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    category: "",
    maxParticipants: "",
  })

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || article.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || event.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleCreateArticle = (asDraft: boolean) => {
    const id = Math.max(...articles.map(a => a.id), 0) + 1
    setArticles([{
      id,
      title: newArticle.title,
      excerpt: newArticle.excerpt,
      category: newArticle.category,
      status: asDraft ? "draft" : "published",
      author: "Super Admin",
      publishedAt: asDraft ? null : new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString().split("T")[0],
      thumbnail: "/news/default.jpg",
      views: 0,
    }, ...articles])
    setNewArticle({ title: "", excerpt: "", content: "", category: "" })
    setIsCreateArticleOpen(false)
  }

  const handleCreateEvent = () => {
    const id = Math.max(...events.map(e => e.id), 0) + 1
    setEvents([{
      id,
      title: newEvent.title,
      description: newEvent.description,
      date: newEvent.date,
      time: newEvent.time,
      location: newEvent.location,
      category: newEvent.category,
      status: "upcoming",
      registrations: 0,
      maxParticipants: parseInt(newEvent.maxParticipants) || 100,
    }, ...events])
    setNewEvent({ title: "", description: "", date: "", time: "", location: "", category: "", maxParticipants: "" })
    setIsCreateEventOpen(false)
  }

  const handleDeleteArticle = (id: number) => {
    setArticles(articles.filter(a => a.id !== id))
  }

  const handleDeleteEvent = (id: number) => {
    setEvents(events.filter(e => e.id !== id))
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      published: "bg-green-100 text-green-700",
      draft: "bg-yellow-100 text-yellow-700",
      archived: "bg-gray-100 text-gray-700",
      upcoming: "bg-blue-100 text-blue-700",
      ongoing: "bg-green-100 text-green-700",
      completed: "bg-gray-100 text-gray-700",
      cancelled: "bg-red-100 text-red-700",
    }
    return colors[status] || "bg-gray-100 text-gray-700"
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">News & Events</h1>
          <p className="text-muted-foreground">
            Create, manage, and publish news articles and events.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-blue-100 p-2">
              <FileText className="h-5 w-5 text-blue-700" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Published</p>
              <p className="text-xl font-bold">{articles.filter(a => a.status === "published").length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-yellow-100 p-2">
              <Edit className="h-5 w-5 text-yellow-700" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Drafts</p>
              <p className="text-xl font-bold">{articles.filter(a => a.status === "draft").length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-green-100 p-2">
              <Calendar className="h-5 w-5 text-green-700" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Upcoming Events</p>
              <p className="text-xl font-bold">{events.filter(e => e.status === "upcoming").length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-primary/10 p-2">
              <Eye className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Views</p>
              <p className="text-xl font-bold">{articles.reduce((acc, a) => acc + a.views, 0).toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="articles" className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <TabsList>
            <TabsTrigger value="articles">Articles</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="w-full pl-9 sm:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-36">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Articles Tab */}
        <TabsContent value="articles" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle>All Articles</CardTitle>
              <Dialog open={isCreateArticleOpen} onOpenChange={setIsCreateArticleOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Article
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Article</DialogTitle>
                    <DialogDescription>
                      Write and publish a news article.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="article-title">Title</Label>
                      <Input
                        id="article-title"
                        value={newArticle.title}
                        onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                        placeholder="Enter article title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="article-category">Category</Label>
                      <Select
                        value={newArticle.category}
                        onValueChange={(value) => setNewArticle({ ...newArticle, category: value })}
                      >
                        <SelectTrigger id="article-category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="article-excerpt">Excerpt</Label>
                      <Textarea
                        id="article-excerpt"
                        value={newArticle.excerpt}
                        onChange={(e) => setNewArticle({ ...newArticle, excerpt: e.target.value })}
                        placeholder="Brief description of the article"
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Thumbnail</Label>
                      <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50">
                        <div className="text-center">
                          <ImagePlus className="mx-auto h-8 w-8 text-muted-foreground" />
                          <p className="mt-1 text-sm text-muted-foreground">Click to upload</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="article-content">Content</Label>
                      <Textarea
                        id="article-content"
                        value={newArticle.content}
                        onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                        placeholder="Write your article content here..."
                        rows={8}
                      />
                      <p className="text-xs text-muted-foreground">
                        Supports basic formatting. You can use markdown for headers, lists, and links.
                      </p>
                    </div>
                  </div>
                  <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={() => handleCreateArticle(true)}>
                      <Archive className="mr-2 h-4 w-4" />
                      Save as Draft
                    </Button>
                    <Button onClick={() => handleCreateArticle(false)}>
                      <Send className="mr-2 h-4 w-4" />
                      Publish
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Article</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredArticles.map((article) => (
                      <TableRow key={article.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-16 rounded bg-muted" />
                            <div>
                              <p className="font-medium">{article.title}</p>
                              <p className="line-clamp-1 text-xs text-muted-foreground">{article.excerpt}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{article.category}</Badge>
                        </TableCell>
                        <TableCell>{article.author}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(article.status)}>{article.status}</Badge>
                        </TableCell>
                        <TableCell>{article.views.toLocaleString()}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {article.publishedAt || article.createdAt}
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
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDeleteArticle(article.id)}
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

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle>All Events</CardTitle>
              <Dialog open={isCreateEventOpen} onOpenChange={setIsCreateEventOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Event
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Create New Event</DialogTitle>
                    <DialogDescription>
                      Schedule a new event for your organization.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="event-title">Event Title</Label>
                      <Input
                        id="event-title"
                        value={newEvent.title}
                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                        placeholder="Enter event title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="event-description">Description</Label>
                      <Textarea
                        id="event-description"
                        value={newEvent.description}
                        onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                        placeholder="Event description"
                        rows={3}
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="event-date">Date</Label>
                        <Input
                          id="event-date"
                          type="date"
                          value={newEvent.date}
                          onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="event-time">Time</Label>
                        <Input
                          id="event-time"
                          type="time"
                          value={newEvent.time}
                          onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="event-location">Location</Label>
                      <Input
                        id="event-location"
                        value={newEvent.location}
                        onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                        placeholder="Event location"
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="event-category">Category</Label>
                        <Select
                          value={newEvent.category}
                          onValueChange={(value) => setNewEvent({ ...newEvent, category: value })}
                        >
                          <SelectTrigger id="event-category">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Seminar">Seminar</SelectItem>
                            <SelectItem value="Workshop">Workshop</SelectItem>
                            <SelectItem value="Meeting">Meeting</SelectItem>
                            <SelectItem value="Tech Talk">Tech Talk</SelectItem>
                            <SelectItem value="Social">Social</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="event-max">Max Participants</Label>
                        <Input
                          id="event-max"
                          type="number"
                          value={newEvent.maxParticipants}
                          onChange={(e) => setNewEvent({ ...newEvent, maxParticipants: e.target.value })}
                          placeholder="100"
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateEventOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateEvent}>Create Event</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredEvents.map((event) => (
                  <Card key={event.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <Badge className={getStatusColor(event.status)}>{event.status}</Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
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
                              onClick={() => handleDeleteEvent(event.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{event.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(event.date).toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{event.time} WIB</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <Badge variant="secondary">{event.category}</Badge>
                        <span className="text-sm">
                          <span className="font-semibold">{event.registrations}</span>
                          <span className="text-muted-foreground">/{event.maxParticipants}</span>
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
