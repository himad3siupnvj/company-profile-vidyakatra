"use client"

import { useEffect, useState } from "react"
import { Archive, CheckCircle2, Edit, Eye, FileText, ImagePlus, Info, Loader2, Monitor, MoreHorizontal, PenLine, Plus, RotateCcw, Search, Send, Trash2, Upload, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import {
  createEmptyArticleDocument,
  NotionArticleEditor,
  type ArticleDocument,
} from "@/components/admin/notion-article-editor"
import { ArticleDocumentRenderer } from "@/components/public/article-document-renderer"
import { getArticleReadTime } from "@/lib/article-content"
import { optimizeImageForUpload, type ImageProcessingStage } from "@/lib/client-image-processing"
import {
  articleWorkflowPermissions,
  getArticleWorkflowActions,
  type ArticleWorkflowAction,
} from "@/lib/article-workflow"
import { useAdminUser } from "@/components/admin/admin-user-context"
import { hasPermission } from "@/lib/permissions"

interface Article {
  id: string
  title: string
  excerpt: string
  category: string
  categoryLabel?: string
  status: "draft" | "submitted" | "approved" | "rejected" | "published" | "archived"
  author: string
  publishedAt: string | null
  createdAt: string
  thumbnail: string
  thumbnailAlt: string
  readTime: string
  featured: boolean
  views: number
  content?: ArticleDocument
}

const articleCategories = [
  { value: "berita", label: "Berita Acara" },
  { value: "kegiatan", label: "Kegiatan" },
  { value: "pengumuman", label: "Pengumuman" },
  { value: "prestasi", label: "Prestasi" },
]

const articlesRequestTimeoutMs = 8000

const workflowActionLabels: Record<ArticleWorkflowAction, string> = {
  submit: "Submit for Review",
  approve: "Approve & Publish",
  reject: "Reject",
  archive: "Archive",
  restore: "Restore Draft",
}

const workflowActionIcons = {
  submit: Send,
  approve: CheckCircle2,
  reject: XCircle,
  archive: Archive,
  restore: RotateCcw,
} satisfies Record<ArticleWorkflowAction, typeof Send>

export default function ArticleManagementPage() {
  const { currentUser } = useAdminUser()
  const [articles, setArticles] = useState<Article[]>([])
  const [nextArticlePage, setNextArticlePage] = useState<number | null>(null)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [isLoadingArticles, setIsLoadingArticles] = useState(true)
  const [isCreateArticleOpen, setIsCreateArticleOpen] = useState(false)
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null)
  const [newArticle, setNewArticle] = useState({
    title: "",
    excerpt: "",
    category: "",
    author: "Tim Media",
    thumbnailUrl: "",
    thumbnailAlt: "",
    featured: false,
  })
  const [articleContent, setArticleContent] = useState<ArticleDocument>(createEmptyArticleDocument())
  const [updatingArticleId, setUpdatingArticleId] = useState<string | null>(null)
  const [coverUploadStage, setCoverUploadStage] = useState<ImageProcessingStage>("idle")
  const [isGeneratingSource, setIsGeneratingSource] = useState(false)
  const [isSavingArticle, setIsSavingArticle] = useState(false)
  const [previewArticle, setPreviewArticle] = useState<Article | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)

    if (params.get("action") === "create") {
      setIsCreateArticleOpen(true)
    }
  }, [])

  useEffect(() => {
    async function loadArticles() {
      setIsLoadingArticles(true)
      setErrorMessage("")
      const controller = new AbortController()
      const timeoutId = window.setTimeout(() => controller.abort(), articlesRequestTimeoutMs)

      try {
        const response = await fetch("/api/admin/articles?page=1&limit=50", {
          cache: "no-store",
          signal: controller.signal,
        })
        const data = await response.json().catch(() => null)

        if (!response.ok) {
          setErrorMessage(data?.error ?? "Artikel gagal dimuat.")
          return
        }

        setArticles(data.articles)
        setNextArticlePage(data.pagination?.hasMore ? 2 : null)
      } catch (error) {
        setErrorMessage(
          error instanceof DOMException && error.name === "AbortError"
            ? "Artikel belum bisa dimuat. Koneksi database terlalu lama merespons."
            : "Artikel gagal dimuat. Coba refresh halaman.",
        )
      } finally {
        window.clearTimeout(timeoutId)
        setIsLoadingArticles(false)
      }
    }

    loadArticles()
  }, [])

  const handleLoadMoreArticles = async () => {
    if (!nextArticlePage || isLoadingMore) return

    setIsLoadingMore(true)

    try {
      const response = await fetch(`/api/admin/articles?page=${nextArticlePage}&limit=50`, {
        cache: "no-store",
      })
      const data = await response.json().catch(() => null)

      if (!response.ok) {
        setErrorMessage(data?.error ?? "Artikel berikutnya gagal dimuat.")
        return
      }

      setArticles((current) => {
        const existingIds = new Set(current.map((article) => article.id))
        return [...current, ...data.articles.filter((article: Article) => !existingIds.has(article.id))]
      })
      setNextArticlePage(data.pagination?.hasMore ? nextArticlePage + 1 : null)
    } catch {
      setErrorMessage("Artikel berikutnya gagal dimuat. Coba lagi sebentar.")
    } finally {
      setIsLoadingMore(false)
    }
  }

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || article.status === filterStatus

    return matchesSearch && matchesStatus
  })

  const resetArticleForm = () => {
    setEditingArticleId(null)
    setNewArticle({ title: "", excerpt: "", category: "", author: "Tim Media", thumbnailUrl: "", thumbnailAlt: "", featured: false })
    setArticleContent(createEmptyArticleDocument())
  }

  const handleDialogOpenChange = (open: boolean) => {
    setIsCreateArticleOpen(open)

    if (!open) {
      resetArticleForm()
    }
  }

  const handleEditArticle = (article: Article) => {
    setEditingArticleId(article.id)
    setNewArticle({
      title: article.title,
      excerpt: article.excerpt,
      category: article.category,
      author: article.author,
      thumbnailUrl: article.thumbnail === "/news/default.jpg" ? "" : article.thumbnail,
      thumbnailAlt: article.thumbnailAlt,
      featured: article.featured,
    })
    setArticleContent(article.content ?? createEmptyArticleDocument())
    setIsCreateArticleOpen(true)
  }

  const handleSaveArticle = async () => {
    if (isSavingArticle) return

    const readTime = getArticleReadTime(articleContent)
    const isEditing = Boolean(editingArticleId)

    setIsSavingArticle(true)

    try {
      const response = await fetch("/api/admin/articles", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingArticleId,
          ...newArticle,
          readTime,
          content: articleContent,
        }),
      })

      if (!response.ok) return

      const data = await response.json()
      setArticles((currentArticles) =>
        isEditing
          ? currentArticles.map((article) => (article.id === editingArticleId ? data.article : article))
          : [data.article, ...currentArticles],
      )
      setIsCreateArticleOpen(false)
      resetArticleForm()
    } catch {
      // The form stays open so the user can retry.
    } finally {
      setIsSavingArticle(false)
    }
  }

  const handleUploadCover = async (file: File | null) => {
    if (!file) return

    setErrorMessage("")
    setCoverUploadStage("compressing")

    let uploadFile = file

    try {
      uploadFile = await optimizeImageForUpload(file, { maxWidth: 1600, maxHeight: 1200 })
    } catch {
      uploadFile = file
    }

    setCoverUploadStage("uploading")

    const formData = new FormData()
    formData.append("file", uploadFile)
    formData.append("purpose", "article-image")
    formData.append("section", "articles")
    formData.append("category", newArticle.category || "general")
    formData.append("kind", "cover")

    try {
      const response = await fetch("/api/admin/assets", {
        method: "POST",
        body: formData,
      })
      const data = await response.json().catch(() => null)

      if (!response.ok) {
        setErrorMessage(data?.error ?? "Upload cover gagal.")
        return
      }

      setNewArticle((current) => ({
        ...current,
        thumbnailUrl: data.asset.url,
        thumbnailAlt: current.thumbnailAlt || data.asset.fileName,
      }))
    } catch {
      setErrorMessage("Upload cover gagal. Coba lagi sebentar.")
    } finally {
      setCoverUploadStage("idle")
    }
  }

  const handleGenerateFromSource = async (file: File | null) => {
    if (!file) return

    setErrorMessage("")
    setIsGeneratingSource(true)

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/admin/articles/generate", {
        method: "POST",
        body: formData,
      })
      const data = await response.json().catch(() => null)

      if (!response.ok) {
        setErrorMessage(data?.error ?? "Generate draft dari source gagal.")
        return
      }

      setArticles((currentArticles) => [data.article, ...currentArticles])
      setIsCreateArticleOpen(false)
      resetArticleForm()
    } catch {
      setErrorMessage("Generate draft dari source gagal. Coba lagi sebentar.")
    } finally {
      setIsGeneratingSource(false)
    }
  }

  const handleDeleteArticle = async (id: string) => {
    const previousArticles = articles
    setArticles(articles.filter((article) => article.id !== id))

    try {
      const response = await fetch(`/api/admin/articles?id=${id}`, { method: "DELETE" })
      if (!response.ok) {
        setArticles(previousArticles)
      }
    } catch {
      setArticles(previousArticles)
    }
  }

  const handleWorkflowAction = async (article: Article, action: ArticleWorkflowAction) => {
    const rejectedNote =
      action === "reject"
        ? window.prompt("Catatan revisi untuk penulis")
        : null

    if (action === "reject" && !rejectedNote?.trim()) {
      return
    }

    setUpdatingArticleId(article.id)

    try {
      const response = await fetch("/api/admin/articles/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: article.id,
          action,
          rejectedNote,
        }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        setErrorMessage(data?.error ?? "Workflow article gagal diproses.")
        return
      }

      const data = await response.json()
      setArticles((currentArticles) =>
        currentArticles.map((currentArticle) =>
          currentArticle.id === article.id ? data.article : currentArticle,
        ),
      )
    } catch {
      setErrorMessage("Workflow article gagal diproses. Coba lagi sebentar.")
    } finally {
      setUpdatingArticleId(null)
    }
  }

  const [errorMessage, setErrorMessage] = useState("")

  const getStatusColor = (status: Article["status"]) => {
    const colors: Record<Article["status"], string> = {
      published: "bg-green-100 text-green-700",
      approved: "bg-emerald-100 text-emerald-700",
      submitted: "bg-blue-100 text-blue-700",
      draft: "bg-yellow-100 text-yellow-700",
      rejected: "bg-red-100 text-red-700",
      archived: "bg-gray-100 text-gray-700",
    }

    return colors[status]
  }

  return (
    <div className="space-y-6">
      <Dialog open={Boolean(previewArticle)} onOpenChange={(open) => !open && setPreviewArticle(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>{previewArticle?.title ?? "Preview Artikel"}</DialogTitle>
            <DialogDescription>
              {previewArticle
                ? `${previewArticle.categoryLabel ?? previewArticle.category} / ${previewArticle.author} / ${previewArticle.readTime}`
                : "Preview isi artikel."}
            </DialogDescription>
          </DialogHeader>
          {previewArticle && (
            <div className="space-y-6">
              <div className="overflow-hidden rounded-md border bg-muted">
                <img
                  src={previewArticle.thumbnail}
                  alt={previewArticle.thumbnailAlt}
                  className="aspect-[16/8] w-full object-cover"
                />
              </div>
              {previewArticle.excerpt && (
                <p className="text-lg leading-8 text-muted-foreground">{previewArticle.excerpt}</p>
              )}
              <ArticleDocumentRenderer
                document={previewArticle.content ?? createEmptyArticleDocument()}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Article Management</h1>
          <p className="text-muted-foreground">
            Tulis, simpan draft, dan ajukan berita acara melalui workflow approval.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-green-100 p-2">
              <FileText className="h-5 w-5 text-green-700" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Published</p>
              {isLoadingArticles ? <Skeleton className="h-7 w-12" /> : <p className="text-xl font-bold">{articles.filter((article) => article.status === "published").length}</p>}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-blue-100 p-2">
              <Send className="h-5 w-5 text-blue-700" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Submitted</p>
              {isLoadingArticles ? <Skeleton className="h-7 w-12" /> : <p className="text-xl font-bold">{articles.filter((article) => article.status === "submitted").length}</p>}
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
              {isLoadingArticles ? <Skeleton className="h-7 w-12" /> : <p className="text-xl font-bold">{articles.filter((article) => article.status === "draft").length}</p>}
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
              {isLoadingArticles ? <Skeleton className="h-7 w-16" /> : <p className="text-xl font-bold">{articles.reduce((acc, article) => acc + article.views, 0).toLocaleString()}</p>}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4 pb-4 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle>All Articles</CardTitle>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                className="w-full pl-9 sm:w-64"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Dialog open={isCreateArticleOpen} onOpenChange={handleDialogOpenChange}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Article
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
                <DialogHeader>
                  <DialogTitle>{editingArticleId ? "Edit Article" : "Create New Article"}</DialogTitle>
                  <DialogDescription>
                    {editingArticleId
                      ? "Edit draft atau artikel revisi sebelum diajukan lagi."
                      : "Buat artikel sebagai draft. Publish akan berjalan otomatis setelah approval."}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="rounded-lg border bg-muted/20 p-4">
                    <div className="mb-4 flex items-start gap-3">
                      <div className="rounded-lg bg-primary/10 p-2 text-primary">
                        <Info className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Info Dasar</h3>
                        <p className="text-sm text-muted-foreground">Data utama yang tampil di card berita.</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="article-title">Judul</Label>
                        <Input
                          id="article-title"
                          value={newArticle.title}
                          onChange={(event) => setNewArticle({ ...newArticle, title: event.target.value })}
                          placeholder="Contoh: Workshop UI/UX Design Bersama Praktisi Industri"
                        />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="article-category">Kategori</Label>
                          <Select
                            value={newArticle.category}
                            onValueChange={(value) => setNewArticle({ ...newArticle, category: value })}
                          >
                            <SelectTrigger id="article-category">
                              <SelectValue placeholder="Pilih kategori" />
                            </SelectTrigger>
                            <SelectContent>
                              {articleCategories.map((category) => (
                                <SelectItem key={category.value} value={category.value}>
                                  {category.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Estimasi Waktu Baca</Label>
                          <Input value={getArticleReadTime(articleContent)} readOnly className="bg-muted/50" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="article-excerpt">Ringkasan</Label>
                        <Textarea
                          id="article-excerpt"
                          value={newArticle.excerpt}
                          onChange={(event) => setNewArticle({ ...newArticle, excerpt: event.target.value })}
                          placeholder="Ringkasan pendek untuk card berita..."
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border bg-muted/20 p-4">
                    <div className="mb-4 flex items-start gap-3">
                      <div className="rounded-lg bg-primary/10 p-2 text-primary">
                        <Upload className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Source Berita Acara</h3>
                        <p className="text-sm text-muted-foreground">Upload sumber berita acara, lalu generate draft dari PDF atau DOCX.</p>
                      </div>
                    </div>
                    <Button type="button" className="relative w-full gap-2" disabled={isGeneratingSource}>
                      {isGeneratingSource ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
                      {isGeneratingSource ? "Generating..." : "Generate Draft from Source"}
                      <input
                        type="file"
                        accept="application/pdf,.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        className="absolute inset-0 cursor-pointer opacity-0 disabled:cursor-not-allowed"
                        disabled={isGeneratingSource}
                        onChange={(event) => handleGenerateFromSource(event.target.files?.[0] ?? null)}
                      />
                    </Button>
                  </div>

                  <div className="rounded-lg border bg-muted/20 p-4">
                    <div className="mb-4 flex items-start gap-3">
                      <div className="rounded-lg bg-primary/10 p-2 text-primary">
                        <Monitor className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Tampilan di Website</h3>
                        <p className="text-sm text-muted-foreground">Atur cover dan status unggulan di halaman publik.</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="grid gap-3 sm:grid-cols-[160px_1fr]">
                        <div className="flex aspect-[16/10] items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-border bg-muted/50">
                          {newArticle.thumbnailUrl ? (
                            <img src={newArticle.thumbnailUrl} alt={newArticle.thumbnailAlt || newArticle.title} className="h-full w-full object-cover" />
                          ) : (
                            <div className="text-center">
                              <ImagePlus className="mx-auto h-7 w-7 text-muted-foreground" />
                              <p className="mt-1 text-xs text-muted-foreground">Preview card</p>
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Input
                            value={newArticle.thumbnailUrl}
                            onChange={(event) => setNewArticle({ ...newArticle, thumbnailUrl: event.target.value })}
                            placeholder="Paste URL gambar cover..."
                          />
                          <Button type="button" variant="outline" size="sm" className="relative w-full gap-2" disabled={coverUploadStage !== "idle"}>
                            {coverUploadStage !== "idle" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                            {coverUploadStage === "compressing" ? "Compressing..." : coverUploadStage === "uploading" ? "Uploading..." : "Upload Cover"}
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp,image/gif"
                              className="absolute inset-0 cursor-pointer opacity-0 disabled:cursor-not-allowed"
                              disabled={coverUploadStage !== "idle"}
                              onChange={(event) => handleUploadCover(event.target.files?.[0] ?? null)}
                            />
                          </Button>
                          <Input
                            value={newArticle.thumbnailAlt}
                            onChange={(event) => setNewArticle({ ...newArticle, thumbnailAlt: event.target.value })}
                            placeholder="Deskripsi gambar untuk aksesibilitas"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between rounded-lg border bg-background/50 p-3">
                        <div>
                          <Label>Jadikan Featured</Label>
                          <p className="text-xs text-muted-foreground">Artikel bisa ditarik ke area unggulan/latest news.</p>
                        </div>
                        <Switch
                          checked={newArticle.featured}
                          onCheckedChange={(checked) => setNewArticle({ ...newArticle, featured: checked })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border bg-muted/20 p-4">
                    <div className="mb-4 flex items-start gap-3">
                      <div className="rounded-lg bg-primary/10 p-2 text-primary">
                        <PenLine className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Publikasi</h3>
                        <p className="text-sm text-muted-foreground">Nama penulis yang terlihat di halaman berita.</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="article-author">Author</Label>
                      <Input
                        id="article-author"
                        value={newArticle.author}
                        onChange={(event) => setNewArticle({ ...newArticle, author: event.target.value })}
                        placeholder="Tim Media"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold">Isi Artikel</h3>
                      <p className="text-sm text-muted-foreground">Tulis artikel di kanvas kosong. Ketik / untuk menambah block.</p>
                    </div>
                    <NotionArticleEditor
                      value={articleContent}
                      onChange={setArticleContent}
                      previewTitle={newArticle.title}
                      previewCategory={articleCategories.find((category) => category.value === newArticle.category)?.label ?? "Berita Acara"}
                      previewMeta={`${newArticle.author || "Tim Media"} / ${getArticleReadTime(articleContent)}`}
                      uploadCategory={newArticle.category || "general"}
                      uploadKind="content"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleSaveArticle} disabled={isSavingArticle}>
                    <Archive className="mr-2 h-4 w-4" />
                    {isSavingArticle ? "Saving..." : editingArticleId ? "Update Draft" : "Save Draft"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {errorMessage && (
            <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {errorMessage}
            </div>
          )}
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
                {isLoadingArticles ? Array.from({ length: 4 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-12 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                  </TableRow>
                )) : filteredArticles.map((article) => (
                  <TableRow key={article.id} className={updatingArticleId === article.id ? "opacity-60" : undefined}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-16 overflow-hidden rounded bg-muted">
                          {article.thumbnail && <img src={article.thumbnail} alt={article.thumbnailAlt} className="h-full w-full object-cover" />}
                        </div>
                        <div>
                          <p className="font-medium">{article.title}</p>
                          <p className="line-clamp-1 text-xs text-muted-foreground">{article.excerpt}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{article.categoryLabel ?? article.category}</Badge>
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
                          {getArticleWorkflowActions(article.status)
                            .filter((action) =>
                              Boolean(
                                currentUser &&
                                hasPermission(currentUser.role, articleWorkflowPermissions[action]),
                              ),
                            )
                            .map((action) => {
                            const Icon = workflowActionIcons[action]

                            return (
                              <DropdownMenuItem
                                key={action}
                                onClick={() => handleWorkflowAction(article, action)}
                                disabled={updatingArticleId === article.id}
                              >
                                <Icon className="mr-2 h-4 w-4" />
                                {workflowActionLabels[action]}
                              </DropdownMenuItem>
                            )
                            })}
                          <DropdownMenuItem onClick={() => setPreviewArticle(article)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEditArticle(article)}
                            disabled={article.status !== "draft" && article.status !== "rejected"}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          {currentUser && hasPermission(currentUser.role, "article.delete") && (
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDeleteArticle(article.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {!isLoadingArticles && filteredArticles.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                        {articles.length === 0
                          ? "Belum ada artikel di database. Buat draft baru atau generate dari PDF/DOCX."
                          : "Tidak ada artikel yang cocok dengan filter saat ini."}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {nextArticlePage && (
            <div className="mt-4 flex justify-center">
              <Button variant="outline" onClick={handleLoadMoreArticles} disabled={isLoadingMore}>
                {isLoadingMore && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoadingMore ? "Loading..." : "Load More Articles"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
