"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Instagram,
  Youtube,
  Linkedin,
  MessageCircle,
  CheckCircle,
} from "lucide-react"

const contactInfo = [
  {
    icon: MapPin,
    title: "Alamat",
    content: "Gedung Fakultas Vokasi, Kampus ITS Sukolilo, Surabaya 60111",
    link: "https://maps.google.com",
  },
  {
    icon: Mail,
    title: "Email",
    content: "himad3si@its.ac.id",
    link: "mailto:himad3si@its.ac.id",
  },
  {
    icon: Phone,
    title: "Telepon",
    content: "+62 31 123 456",
    link: "tel:+6231123456",
  },
  {
    icon: Clock,
    title: "Jam Operasional",
    content: "Senin - Jumat: 08.00 - 16.00 WIB",
    link: null,
  },
]

const socialMedia = [
  {
    icon: Instagram,
    name: "Instagram",
    handle: "@himad3si_its",
    url: "https://instagram.com/himad3si_its",
    color: "bg-gradient-to-r from-purple-500 to-pink-500",
  },
  {
    icon: Youtube,
    name: "YouTube",
    handle: "HIMA D3 SI ITS",
    url: "https://youtube.com",
    color: "bg-red-500",
  },
  {
    icon: Linkedin,
    name: "LinkedIn",
    handle: "HIMA D3 SI ITS",
    url: "https://linkedin.com",
    color: "bg-blue-600",
  },
  {
    icon: MessageCircle,
    name: "Line",
    handle: "@himad3si",
    url: "https://line.me",
    color: "bg-green-500",
  },
]

const faqs = [
  {
    question: "Bagaimana cara bergabung dengan HIMA D3 SI?",
    answer: "Pendaftaran anggota baru dibuka setiap awal tahun ajaran. Ikuti pengumuman di media sosial kami untuk informasi lebih lanjut.",
  },
  {
    question: "Apakah ada biaya keanggotaan?",
    answer: "Ya, ada iuran keanggotaan tahunan yang digunakan untuk mendanai berbagai kegiatan organisasi.",
  },
  {
    question: "Kegiatan apa saja yang diadakan HIMA?",
    answer: "HIMA D3 SI menyelenggarakan berbagai kegiatan seperti seminar, workshop, kompetisi, kunjungan industri, dan gathering.",
  },
  {
    question: "Bagaimana cara mengajukan proposal kerjasama?",
    answer: "Silakan kirim proposal kerjasama melalui email resmi kami atau hubungi divisi Humas melalui form di atas.",
  },
]

export default function KontakPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setIsSubmitted(true)
    setFormData({ name: "", email: "", subject: "", message: "" })
    // Reset success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000)
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-secondary py-20 md:py-28">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="relative mx-auto max-w-7xl px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/10 text-primary">
              Hubungi Kami
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-secondary-foreground md:text-5xl text-balance">
              Mari Terhubung dengan HIMA D3 SI
            </h1>
            <p className="mt-6 text-lg text-secondary-foreground/80">
              Punya pertanyaan, saran, atau ingin berkolaborasi? Jangan ragu untuk menghubungi kami
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info & Form Section */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-5">
            {/* Contact Info */}
            <div className="space-y-8 lg:col-span-2">
              <div>
                <h2 className="mb-4 text-2xl font-bold">Informasi Kontak</h2>
                <p className="text-muted-foreground">
                  Kami siap membantu menjawab pertanyaan dan memproses permintaan Anda.
                </p>
              </div>

              <div className="space-y-4">
                {contactInfo.map((info) => (
                  <Card key={info.title} className="transition-all hover:shadow-md">
                    <CardContent className="flex items-start gap-4 p-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                        <info.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{info.title}</h3>
                        {info.link ? (
                          <a
                            href={info.link}
                            target={info.link.startsWith("http") ? "_blank" : undefined}
                            rel="noopener noreferrer"
                            className="text-sm text-muted-foreground hover:text-primary"
                          >
                            {info.content}
                          </a>
                        ) : (
                          <p className="text-sm text-muted-foreground">{info.content}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Social Media */}
              <div>
                <h3 className="mb-4 font-semibold">Ikuti Kami</h3>
                <div className="grid grid-cols-2 gap-3">
                  {socialMedia.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-lg border p-3 transition-all hover:shadow-md hover:border-primary/30"
                    >
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg text-white ${social.color}`}>
                        <social.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">{social.name}</div>
                        <div className="text-xs text-muted-foreground">{social.handle}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>Kirim Pesan</CardTitle>
                </CardHeader>
                <CardContent>
                  {isSubmitted ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="mb-2 text-xl font-semibold">Pesan Terkirim!</h3>
                      <p className="text-muted-foreground">
                        Terima kasih telah menghubungi kami. Kami akan segera merespons pesan Anda.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nama Lengkap</Label>
                          <Input
                            id="name"
                            placeholder="Masukkan nama Anda"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="nama@email.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subjek</Label>
                        <Input
                          id="subject"
                          placeholder="Topik pesan Anda"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">Pesan</Label>
                        <Textarea
                          id="message"
                          placeholder="Tulis pesan Anda di sini..."
                          rows={6}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          required
                        />
                      </div>
                      <Button type="submit" size="lg" className="w-full gap-2" disabled={isSubmitting}>
                        {isSubmitting ? (
                          "Mengirim..."
                        ) : (
                          <>
                            Kirim Pesan
                            <Send className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="bg-muted/50 py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold">Lokasi Kami</h2>
            <p className="mt-2 text-muted-foreground">
              Kunjungi sekretariat HIMA D3 SI di Kampus ITS Sukolilo
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.5462611858714!2d112.79281507454707!3d-7.285387392726025!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7fa10ea2ae883%3A0xbe22c55d60ef09c7!2sInstitut%20Teknologi%20Sepuluh%20Nopember!5e0!3m2!1sen!2sid!4v1699876543210!5m2!1sen!2sid"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-12 text-center">
            <Badge variant="outline" className="mb-4 border-primary/30">FAQ</Badge>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Pertanyaan Umum
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Jawaban untuk pertanyaan yang sering diajukan
            </p>
          </div>
          <div className="mx-auto max-w-3xl space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="mb-2 font-semibold">{faq.question}</h3>
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-secondary py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-secondary-foreground">
              Ingin Tahu Lebih Banyak?
            </h2>
            <p className="mt-4 text-secondary-foreground/80">
              Kunjungi halaman lain untuk mengenal HIMA D3 SI lebih dalam
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Button asChild>
                <a href="/profil">Tentang Kami</a>
              </Button>
              <Button variant="outline" className="border-secondary-foreground/20 text-secondary-foreground hover:bg-secondary-foreground/10" asChild>
                <a href="/berita">Berita Terbaru</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
