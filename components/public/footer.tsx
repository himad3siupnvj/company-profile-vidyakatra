import Link from "next/link"
import Image from "next/image"
import logoHima from "@/assets/hima.png"
import logoKabinet from "@/assets/logoKabinet.png"
import { Clock, Instagram, Mail, MapPin, Music2, Youtube, Linkedin } from "lucide-react"

const quickLinks = [
  { href: "/", label: "Beranda" },
  { href: "/profil", label: "Profil" },
  { href: "/berita", label: "Berita Acara" },
  { href: "/kontak", label: "Collaborate" },
]

const organizationLinks = [
  { href: "/profil#visi-misi", label: "Visi & Misi" },
  { href: "/profil#struktur", label: "Struktur Organisasi" },
  { href: "/profil#sejarah", label: "Sejarah" },
  { href: "/profil#divisi", label: "Divisi" },
]

const socialLinks = [
  { href: "https://instagram.com", icon: Instagram, label: "Instagram" },
  { href: "https://youtube.com", icon: Youtube, label: "YouTube" },
  { href: "https://linkedin.com", icon: Linkedin, label: "LinkedIn" },
  { href: "https://tiktok.com", icon: Music2, label: "TikTok" },
]

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card">
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-8 md:px-6 lg:pb-12 lg:pt-10">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-[1.7fr_0.9fr_0.9fr_1.25fr] lg:gap-5">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="group flex items-start gap-3">
              <div className="flex shrink-0 items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-md bg-background transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src={logoHima}
                    alt="Logo HIMA D3 SI UPNVJ"
                    width={40}
                    height={40}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-md bg-background transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src={logoKabinet}
                    alt="Logo Kabinet Vidyakatra"
                    width={40}
                    height={40}
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
              <div className="flex min-w-0 max-w-[18rem] flex-col pt-0.5">
                <span className="text-sm font-bold leading-snug tracking-wide sm:text-base">HIMA D3 Sistem Informasi UPNVJ</span>
                <span className="text-xs text-primary">Kabinet Vidyakatra</span>
              </div>
            </Link>
            <p className="max-w-[19rem] text-sm leading-relaxed text-[#b8b8b8]">
              Himpunan Mahasiswa D3 Sistem Informasi UPNVJ, wadah pengembangan potensi dan kreativitas mahasiswa dalam bidang teknologi informasi.
            </p>
            <div className="flex gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/50 bg-muted/50 text-[#b8b8b8] transition-all duration-200 hover:scale-105 hover:border-primary/60 hover:bg-primary/10 hover:text-primary hover:shadow-[0_0_18px_rgba(234,179,8,0.22)]"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Navigasi</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#b8b8b8] transition-colors duration-300 hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Organization */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Organisasi</h3>
            <ul className="space-y-2">
              {organizationLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#b8b8b8] transition-colors duration-300 hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Kontak</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-[#b8b8b8]">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>UPN Veteran Jakarta, Pondok Labu, Jakarta Selatan</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-[#b8b8b8]">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                <a href="mailto:himpunand3si@gmail.com" className="transition-colors duration-300 hover:text-primary">
                  himpunand3si@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-[#b8b8b8]">
                <Clock className="h-4 w-4 shrink-0 text-primary" />
                <span>Senin - Jumat, 08.00 - 16.00 WIB</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 flex flex-col gap-2 border-t border-border/50 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-[#b8b8b8]">
            &copy; {new Date().getFullYear()} HIMA D3 Sistem Informasi UPNVJ. Kabinet Vidyakatra.
          </p>
        </div>
      </div>
    </footer>
  )
}
