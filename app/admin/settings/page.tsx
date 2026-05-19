"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Save, Globe, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube, Linkedin, Github } from "lucide-react"

export default function SettingsPage() {
  const [contactInfo, setContactInfo] = useState({
    email: "hima.d3si@politeknik.ac.id",
    phone: "+62 21 1234567",
    whatsapp: "+62 812 3456 7890",
    address: "Gedung Jurusan Sistem Informasi, Lantai 2\nJl. Kampus Raya No. 1\nKota Bandung, Jawa Barat 40123",
  })

  const [socialMedia, setSocialMedia] = useState({
    instagram: "https://instagram.com/himad3si",
    facebook: "https://facebook.com/himad3si",
    twitter: "https://twitter.com/himad3si",
    youtube: "https://youtube.com/@himad3si",
    linkedin: "https://linkedin.com/company/himad3si",
    github: "https://github.com/himad3si",
  })

  const [footerSettings, setFooterSettings] = useState({
    showSocialMedia: true,
    showContactInfo: true,
    showQuickLinks: true,
    showNewsletter: true,
    copyrightText: "© 2024 HIMA D3 Sistem Informasi. All rights reserved.",
  })

  const [quickLinks, setQuickLinks] = useState([
    { id: 1, label: "Tentang Kami", url: "/about", enabled: true },
    { id: 2, label: "Visi & Misi", url: "/vision-mission", enabled: true },
    { id: 3, label: "Struktur Organisasi", url: "/organization", enabled: true },
    { id: 4, label: "Berita & Acara", url: "/news", enabled: true },
    { id: 5, label: "Galeri", url: "/gallery", enabled: true },
    { id: 6, label: "Kontak", url: "/contact", enabled: true },
  ])

  const [siteSettings, setSiteSettings] = useState({
    siteName: "HIMA D3 Sistem Informasi",
    siteDescription: "Website resmi Himpunan Mahasiswa D3 Sistem Informasi",
    maintenanceMode: false,
    analyticsEnabled: true,
  })

  const updateQuickLink = (id: number, field: string, value: string | boolean) => {
    setQuickLinks(quickLinks.map(link =>
      link.id === id ? { ...link, [field]: value } : link
    ))
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Settings</h1>
          <p className="text-muted-foreground">
            Configure website settings, contact information, and footer.
          </p>
        </div>
        <Button className="gap-2">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="footer">Footer</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Site Settings</CardTitle>
              <CardDescription>
                General website configuration and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="site-name">Site Name</Label>
                <Input
                  id="site-name"
                  value={siteSettings.siteName}
                  onChange={(e) => setSiteSettings({ ...siteSettings, siteName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site-description">Site Description</Label>
                <Input
                  id="site-description"
                  value={siteSettings.siteDescription}
                  onChange={(e) => setSiteSettings({ ...siteSettings, siteDescription: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Used for SEO and social media sharing.
                </p>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label>Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    When enabled, visitors will see a maintenance page.
                  </p>
                </div>
                <Switch
                  checked={siteSettings.maintenanceMode}
                  onCheckedChange={(checked) => setSiteSettings({ ...siteSettings, maintenanceMode: checked })}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label>Analytics</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable visitor tracking and analytics.
                  </p>
                </div>
                <Switch
                  checked={siteSettings.analyticsEnabled}
                  onCheckedChange={(checked) => setSiteSettings({ ...siteSettings, analyticsEnabled: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Information */}
        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Organization contact details displayed on the website.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      className="pl-9"
                      value={contactInfo.email}
                      onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="phone"
                      className="pl-9"
                      value={contactInfo.phone}
                      onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="whatsapp"
                    className="pl-9"
                    value={contactInfo.whatsapp}
                    onChange={(e) => setContactInfo({ ...contactInfo, whatsapp: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="address"
                    className="pl-9"
                    value={contactInfo.address}
                    onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Media */}
        <TabsContent value="social" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>
                Connect your organization&apos;s social media accounts.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <div className="relative">
                    <Instagram className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="instagram"
                      className="pl-9"
                      value={socialMedia.instagram}
                      onChange={(e) => setSocialMedia({ ...socialMedia, instagram: e.target.value })}
                      placeholder="https://instagram.com/..."
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <div className="relative">
                    <Facebook className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="facebook"
                      className="pl-9"
                      value={socialMedia.facebook}
                      onChange={(e) => setSocialMedia({ ...socialMedia, facebook: e.target.value })}
                      placeholder="https://facebook.com/..."
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter / X</Label>
                  <div className="relative">
                    <Twitter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="twitter"
                      className="pl-9"
                      value={socialMedia.twitter}
                      onChange={(e) => setSocialMedia({ ...socialMedia, twitter: e.target.value })}
                      placeholder="https://twitter.com/..."
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="youtube">YouTube</Label>
                  <div className="relative">
                    <Youtube className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="youtube"
                      className="pl-9"
                      value={socialMedia.youtube}
                      onChange={(e) => setSocialMedia({ ...socialMedia, youtube: e.target.value })}
                      placeholder="https://youtube.com/..."
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <div className="relative">
                    <Linkedin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="linkedin"
                      className="pl-9"
                      value={socialMedia.linkedin}
                      onChange={(e) => setSocialMedia({ ...socialMedia, linkedin: e.target.value })}
                      placeholder="https://linkedin.com/..."
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github">GitHub</Label>
                  <div className="relative">
                    <Github className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="github"
                      className="pl-9"
                      value={socialMedia.github}
                      onChange={(e) => setSocialMedia({ ...socialMedia, github: e.target.value })}
                      placeholder="https://github.com/..."
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Footer Settings */}
        <TabsContent value="footer" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Footer Configuration</CardTitle>
              <CardDescription>
                Customize the footer sections and content.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <Label>Show Social Media</Label>
                    <p className="text-xs text-muted-foreground">Display social media icons</p>
                  </div>
                  <Switch
                    checked={footerSettings.showSocialMedia}
                    onCheckedChange={(checked) => setFooterSettings({ ...footerSettings, showSocialMedia: checked })}
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <Label>Show Contact Info</Label>
                    <p className="text-xs text-muted-foreground">Display contact information</p>
                  </div>
                  <Switch
                    checked={footerSettings.showContactInfo}
                    onCheckedChange={(checked) => setFooterSettings({ ...footerSettings, showContactInfo: checked })}
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <Label>Show Quick Links</Label>
                    <p className="text-xs text-muted-foreground">Display navigation links</p>
                  </div>
                  <Switch
                    checked={footerSettings.showQuickLinks}
                    onCheckedChange={(checked) => setFooterSettings({ ...footerSettings, showQuickLinks: checked })}
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <Label>Show Newsletter</Label>
                    <p className="text-xs text-muted-foreground">Display newsletter signup</p>
                  </div>
                  <Switch
                    checked={footerSettings.showNewsletter}
                    onCheckedChange={(checked) => setFooterSettings({ ...footerSettings, showNewsletter: checked })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="copyright">Copyright Text</Label>
                <Input
                  id="copyright"
                  value={footerSettings.copyrightText}
                  onChange={(e) => setFooterSettings({ ...footerSettings, copyrightText: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
              <CardDescription>
                Manage footer navigation links.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {quickLinks.map((link) => (
                <div key={link.id} className="flex items-center gap-4 rounded-lg border p-4">
                  <div className="grid flex-1 gap-4 md:grid-cols-2">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Label</Label>
                      <Input
                        value={link.label}
                        onChange={(e) => updateQuickLink(link.id, "label", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">URL</Label>
                      <Input
                        value={link.url}
                        onChange={(e) => updateQuickLink(link.id, "url", e.target.value)}
                      />
                    </div>
                  </div>
                  <Switch
                    checked={link.enabled}
                    onCheckedChange={(checked) => updateQuickLink(link.id, "enabled", checked)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
