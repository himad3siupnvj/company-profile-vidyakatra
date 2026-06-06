"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Save, Plus, Trash2, GripVertical, ImagePlus, Eye } from "lucide-react"
import { Switch } from "@/components/ui/switch"

interface Achievement {
  id: number
  title: string
  description: string
  icon: string
  enabled: boolean
}

export default function HomePageManagement() {
  const [heroData, setHeroData] = useState({
    title: "HIMA D3 Sistem Informasi",
    subtitle: "Himpunan Mahasiswa D3 Sistem Informasi",
    description: "Wadah aspirasi dan pengembangan potensi mahasiswa D3 Sistem Informasi untuk menjadi pribadi yang unggul dan berdaya saing.",
    ctaText: "Bergabung Sekarang",
    ctaLink: "/join",
    backgroundImage: "/hero-bg.jpg",
  })

  const [aboutData, setAboutData] = useState({
    title: "Tentang Kami",
    description: "HIMA D3 Sistem Informasi adalah organisasi kemahasiswaan yang berfokus pada pengembangan softskill dan hardskill mahasiswa dalam bidang teknologi informasi.",
    image: "/about-image.jpg",
  })

  const [achievements, setAchievements] = useState<Achievement[]>([
    { id: 1, title: "500+", description: "Alumni Sukses", icon: "users", enabled: true },
    { id: 2, title: "25+", description: "Program Kerja", icon: "clipboard", enabled: true },
    { id: 3, title: "20+", description: "Penghargaan", icon: "trophy", enabled: true },
    { id: 4, title: "8", description: "Departemen Aktif", icon: "building", enabled: true },
  ])

  const [ctaSection, setCtaSection] = useState({
    title: "Siap Bergabung?",
    description: "Jadilah bagian dari keluarga besar HIMA D3 Sistem Informasi dan kembangkan potensimu bersama kami.",
    buttonText: "Daftar Sekarang",
    buttonLink: "/register",
    enabled: true,
  })

  const addAchievement = () => {
    const newId = Math.max(...achievements.map(a => a.id), 0) + 1
    setAchievements([...achievements, {
      id: newId,
      title: "",
      description: "",
      icon: "star",
      enabled: true,
    }])
  }

  const removeAchievement = (id: number) => {
    setAchievements(achievements.filter(a => a.id !== id))
  }

  const updateAchievement = (id: number, field: keyof Achievement, value: string | boolean) => {
    setAchievements(achievements.map(a => 
      a.id === id ? { ...a, [field]: value } : a
    ))
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Home Page Management</h1>
          <p className="text-muted-foreground">
            Manage the content displayed on your website&apos;s home page.
          </p>
        </div>
        <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto">
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
      <Tabs defaultValue="hero" className="space-y-6">
        <TabsList className="grid h-auto w-full grid-cols-2 gap-1 sm:grid-cols-4 lg:w-auto">
          <TabsTrigger value="hero" className="h-9 whitespace-normal text-center leading-tight">Hero Section</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="achievements" className="h-9 whitespace-normal text-center leading-tight">Achievements</TabsTrigger>
          <TabsTrigger value="cta" className="h-9 whitespace-normal text-center leading-tight">CTA Section</TabsTrigger>
        </TabsList>

        {/* Hero Section */}
        <TabsContent value="hero" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>
                Configure the main banner that appears at the top of your home page.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="hero-title">Main Title</Label>
                  <Input
                    id="hero-title"
                    value={heroData.title}
                    onChange={(e) => setHeroData({ ...heroData, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hero-subtitle">Subtitle</Label>
                  <Input
                    id="hero-subtitle"
                    value={heroData.subtitle}
                    onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="hero-description">Description</Label>
                <Textarea
                  id="hero-description"
                  value={heroData.description}
                  onChange={(e) => setHeroData({ ...heroData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="cta-text">CTA Button Text</Label>
                  <Input
                    id="cta-text"
                    value={heroData.ctaText}
                    onChange={(e) => setHeroData({ ...heroData, ctaText: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cta-link">CTA Button Link</Label>
                  <Input
                    id="cta-link"
                    value={heroData.ctaLink}
                    onChange={(e) => setHeroData({ ...heroData, ctaLink: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Background Image</Label>
                <div className="flex items-center gap-4">
                  <div className="flex h-32 w-48 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50">
                    <div className="text-center">
                      <ImagePlus className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="mt-1 text-xs text-muted-foreground">Upload image</p>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Current: hero-bg.jpg</p>
                    <p className="text-xs text-muted-foreground">Recommended: 1920x1080px, max 2MB</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Change Image
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* About Section */}
        <TabsContent value="about" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>About Section</CardTitle>
              <CardDescription>
                Edit the about section that describes your organization.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="about-title">Section Title</Label>
                <Input
                  id="about-title"
                  value={aboutData.title}
                  onChange={(e) => setAboutData({ ...aboutData, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="about-description">Description</Label>
                <Textarea
                  id="about-description"
                  value={aboutData.description}
                  onChange={(e) => setAboutData({ ...aboutData, description: e.target.value })}
                  rows={5}
                />
              </div>
              <div className="space-y-2">
                <Label>Section Image</Label>
                <div className="flex items-center gap-4">
                  <div className="flex h-32 w-48 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50">
                    <div className="text-center">
                      <ImagePlus className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="mt-1 text-xs text-muted-foreground">Upload image</p>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Current: about-image.jpg</p>
                    <p className="text-xs text-muted-foreground">Recommended: 800x600px</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Change Image
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Achievements Section */}
        <TabsContent value="achievements" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Achievement Cards</CardTitle>
                <CardDescription>
                  Manage the achievement statistics displayed on the home page.
                </CardDescription>
              </div>
              <Button onClick={addAchievement} size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Card
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex items-start gap-4 rounded-lg border p-4"
                >
                  <button className="mt-2 cursor-grab text-muted-foreground hover:text-foreground">
                    <GripVertical className="h-5 w-5" />
                  </button>
                  <div className="grid flex-1 gap-4 md:grid-cols-4">
                    <div className="space-y-2">
                      <Label>Value/Number</Label>
                      <Input
                        value={achievement.title}
                        onChange={(e) => updateAchievement(achievement.id, "title", e.target.value)}
                        placeholder="e.g., 500+"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Input
                        value={achievement.description}
                        onChange={(e) => updateAchievement(achievement.id, "description", e.target.value)}
                        placeholder="e.g., Alumni Sukses"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Icon</Label>
                      <Input
                        value={achievement.icon}
                        onChange={(e) => updateAchievement(achievement.id, "icon", e.target.value)}
                        placeholder="e.g., users"
                      />
                    </div>
                    <div className="flex items-end gap-4">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={achievement.enabled}
                          onCheckedChange={(checked) => updateAchievement(achievement.id, "enabled", checked)}
                        />
                        <Label className="text-sm">
                          {achievement.enabled ? (
                            <Badge>Active</Badge>
                          ) : (
                            <Badge variant="secondary">Hidden</Badge>
                          )}
                        </Label>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeAchievement(achievement.id)}
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* CTA Section */}
        <TabsContent value="cta" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Call to Action Section</CardTitle>
                <CardDescription>
                  Configure the CTA section at the bottom of the home page.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="cta-enabled" className="text-sm">Enable Section</Label>
                <Switch
                  id="cta-enabled"
                  checked={ctaSection.enabled}
                  onCheckedChange={(checked) => setCtaSection({ ...ctaSection, enabled: checked })}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="cta-title">Section Title</Label>
                <Input
                  id="cta-title"
                  value={ctaSection.title}
                  onChange={(e) => setCtaSection({ ...ctaSection, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cta-description">Description</Label>
                <Textarea
                  id="cta-description"
                  value={ctaSection.description}
                  onChange={(e) => setCtaSection({ ...ctaSection, description: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="cta-button-text">Button Text</Label>
                  <Input
                    id="cta-button-text"
                    value={ctaSection.buttonText}
                    onChange={(e) => setCtaSection({ ...ctaSection, buttonText: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cta-button-link">Button Link</Label>
                  <Input
                    id="cta-button-link"
                    value={ctaSection.buttonLink}
                    onChange={(e) => setCtaSection({ ...ctaSection, buttonLink: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
