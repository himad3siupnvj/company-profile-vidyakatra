"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, X, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/profil", label: "Profil" },
  { href: "/berita", label: "Berita" },
  { href: "/galeri", label: "Galeri" },
  { href: "/kontak", label: "Kontak" },
]

export function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-brand transition-all duration-300 group-hover:glow-primary-sm">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold leading-tight tracking-wide">HIMA D3 SI</span>
            <span className="text-xs text-muted-foreground">Sistem Informasi</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative px-4 py-2 text-sm font-medium transition-all duration-300",
                pathname === link.href
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {link.label}
              {pathname === link.href && (
                <span className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-primary glow-primary-sm" />
              )}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <Link href="/admin">
            <Button 
              variant="outline" 
              size="sm"
              className="border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 hover:glow-primary-sm transition-all duration-300"
            >
              Admin
            </Button>
          </Link>
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="hover:bg-muted">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] border-l border-border/50 bg-background p-0">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-border/50 p-4">
                <Link href="/" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-brand">
                    <Zap className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="font-bold tracking-wide">HIMA D3 SI</span>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="hover:bg-muted">
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="flex flex-1 flex-col gap-1 p-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "rounded-lg px-4 py-3 text-sm font-medium transition-all duration-300",
                      pathname === link.href
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="border-t border-border/50 p-4">
                <Link href="/admin" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-gradient-brand text-primary-foreground hover:opacity-90">
                    Admin Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
