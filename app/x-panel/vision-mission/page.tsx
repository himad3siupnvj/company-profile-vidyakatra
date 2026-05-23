"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Save, Plus, Trash2, GripVertical, Eye, Target, Lightbulb, Heart, Star } from "lucide-react"

interface Mission {
  id: number
  text: string
  enabled: boolean
}

interface Value {
  id: number
  title: string
  description: string
  icon: string
  enabled: boolean
}

export default function VisionMissionManagement() {
  const [philosophy, setPhilosophy] = useState({
    title: "Filosofi Organisasi",
    description: "HIMA D3 Sistem Informasi hadir sebagai wadah pengembangan potensi mahasiswa yang berlandaskan pada nilai-nilai integritas, inovasi, dan kebersamaan untuk menciptakan generasi yang unggul di bidang teknologi informasi.",
    enabled: true,
  })

  const [vision, setVision] = useState({
    title: "Visi",
    description: "Menjadi organisasi kemahasiswaan yang unggul, inovatif, dan berdaya saing dalam mengembangkan potensi mahasiswa D3 Sistem Informasi untuk menghadapi tantangan era digital.",
    enabled: true,
  })

  const [missions, setMissions] = useState<Mission[]>([
    { id: 1, text: "Mengembangkan softskill dan hardskill mahasiswa melalui program kerja yang berkualitas", enabled: true },
    { id: 2, text: "Memfasilitasi kegiatan akademik dan non-akademik yang mendukung pengembangan diri mahasiswa", enabled: true },
    { id: 3, text: "Menjalin kerjasama dengan berbagai pihak untuk memperluas jaringan dan kesempatan", enabled: true },
    { id: 4, text: "Menciptakan lingkungan yang kondusif untuk belajar dan berkreasi", enabled: true },
    { id: 5, text: "Menjadi jembatan aspirasi mahasiswa dengan pihak jurusan dan universitas", enabled: true },
  ])

  const [values, setValues] = useState<Value[]>([
    { id: 1, title: "Integritas", description: "Menjunjung tinggi kejujuran dan tanggung jawab dalam setiap tindakan", icon: "star", enabled: true },
    { id: 2, title: "Inovasi", description: "Terus berinovasi dan kreatif dalam menghadapi tantangan", icon: "lightbulb", enabled: true },
    { id: 3, title: "Kebersamaan", description: "Membangun solidaritas dan kerjasama yang kuat antar anggota", icon: "heart", enabled: true },
    { id: 4, title: "Profesionalisme", description: "Bekerja dengan standar profesional tinggi", icon: "target", enabled: true },
  ])

  const addMission = () => {
    const newId = Math.max(...missions.map(m => m.id), 0) + 1
    setMissions([...missions, { id: newId, text: "", enabled: true }])
  }

  const removeMission = (id: number) => {
    setMissions(missions.filter(m => m.id !== id))
  }

  const updateMission = (id: number, field: keyof Mission, value: string | boolean) => {
    setMissions(missions.map(m => m.id === id ? { ...m, [field]: value } : m))
  }

  const addValue = () => {
    const newId = Math.max(...values.map(v => v.id), 0) + 1
    setValues([...values, { id: newId, title: "", description: "", icon: "star", enabled: true }])
  }

  const removeValue = (id: number) => {
    setValues(values.filter(v => v.id !== id))
  }

  const updateValue = (id: number, field: keyof Value, value: string | boolean) => {
    setValues(values.map(v => v.id === id ? { ...v, [field]: value } : v))
  }

  const getIconComponent = (icon: string) => {
    const icons: Record<string, typeof Star> = {
      star: Star,
      lightbulb: Lightbulb,
      heart: Heart,
      target: Target,
    }
    const Icon = icons[icon] || Star
    return <Icon className="h-5 w-5" />
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Vision & Mission</h1>
          <p className="text-muted-foreground">
            Manage the organization&apos;s philosophy, vision, mission, and core values.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Eye className="h-4 w-4" />
            Preview
          </Button>
          <Button className="gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="philosophy" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="philosophy">Philosophy</TabsTrigger>
          <TabsTrigger value="vision">Vision</TabsTrigger>
          <TabsTrigger value="mission">Mission</TabsTrigger>
          <TabsTrigger value="values">Values</TabsTrigger>
        </TabsList>

        {/* Philosophy Tab */}
        <TabsContent value="philosophy" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Organization Philosophy</CardTitle>
                <CardDescription>
                  The fundamental beliefs and principles that guide the organization.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="philosophy-enabled" className="text-sm">Enable Section</Label>
                <Switch
                  id="philosophy-enabled"
                  checked={philosophy.enabled}
                  onCheckedChange={(checked) => setPhilosophy({ ...philosophy, enabled: checked })}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="philosophy-title">Section Title</Label>
                <Input
                  id="philosophy-title"
                  value={philosophy.title}
                  onChange={(e) => setPhilosophy({ ...philosophy, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="philosophy-description">Philosophy Description</Label>
                <Textarea
                  id="philosophy-description"
                  value={philosophy.description}
                  onChange={(e) => setPhilosophy({ ...philosophy, description: e.target.value })}
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vision Tab */}
        <TabsContent value="vision" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Organization Vision</CardTitle>
                <CardDescription>
                  The long-term goal and aspiration of the organization.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="vision-enabled" className="text-sm">Enable Section</Label>
                <Switch
                  id="vision-enabled"
                  checked={vision.enabled}
                  onCheckedChange={(checked) => setVision({ ...vision, enabled: checked })}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="vision-title">Section Title</Label>
                <Input
                  id="vision-title"
                  value={vision.title}
                  onChange={(e) => setVision({ ...vision, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vision-description">Vision Statement</Label>
                <Textarea
                  id="vision-description"
                  value={vision.description}
                  onChange={(e) => setVision({ ...vision, description: e.target.value })}
                  rows={4}
                />
              </div>
              
              {/* Preview */}
              <div className="rounded-lg border bg-muted/30 p-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-primary/10 p-3">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{vision.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{vision.description}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mission Tab */}
        <TabsContent value="mission" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Organization Mission</CardTitle>
                <CardDescription>
                  The specific actions and objectives to achieve the vision.
                </CardDescription>
              </div>
              <Button onClick={addMission} size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Mission
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {missions.map((mission, index) => (
                <div
                  key={mission.id}
                  className="flex items-start gap-4 rounded-lg border p-4"
                >
                  <button className="mt-1 cursor-grab text-muted-foreground hover:text-foreground">
                    <GripVertical className="h-5 w-5" />
                  </button>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {index + 1}
                  </div>
                  <div className="flex-1 space-y-2">
                    <Textarea
                      value={mission.text}
                      onChange={(e) => updateMission(mission.id, "text", e.target.value)}
                      placeholder="Enter mission statement..."
                      rows={2}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={mission.enabled}
                      onCheckedChange={(checked) => updateMission(mission.id, "enabled", checked)}
                    />
                    <Badge variant={mission.enabled ? "default" : "secondary"}>
                      {mission.enabled ? "Active" : "Hidden"}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeMission(mission.id)}
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Values Tab */}
        <TabsContent value="values" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Organization Values</CardTitle>
                <CardDescription>
                  Core values that define the organization&apos;s culture.
                </CardDescription>
              </div>
              <Button onClick={addValue} size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Value
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {values.map((value) => (
                <div
                  key={value.id}
                  className="flex items-start gap-4 rounded-lg border p-4"
                >
                  <button className="mt-1 cursor-grab text-muted-foreground hover:text-foreground">
                    <GripVertical className="h-5 w-5" />
                  </button>
                  <div className="grid flex-1 gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={value.title}
                        onChange={(e) => updateValue(value.id, "title", e.target.value)}
                        placeholder="e.g., Integrity"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Description</Label>
                      <Input
                        value={value.description}
                        onChange={(e) => updateValue(value.id, "description", e.target.value)}
                        placeholder="Brief description of this value"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-primary/10 p-2">
                      {getIconComponent(value.icon)}
                    </div>
                    <Switch
                      checked={value.enabled}
                      onCheckedChange={(checked) => updateValue(value.id, "enabled", checked)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeValue(value.id)}
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {/* Preview */}
              <div className="mt-6 rounded-lg border bg-muted/30 p-6">
                <h4 className="mb-4 font-semibold">Preview</h4>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {values.filter(v => v.enabled).map((value) => (
                    <div key={value.id} className="rounded-lg border bg-card p-4 text-center">
                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        {getIconComponent(value.icon)}
                      </div>
                      <h5 className="font-semibold">{value.title || "Title"}</h5>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {value.description || "Description"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
