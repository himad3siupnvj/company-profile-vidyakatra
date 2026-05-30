import { Navbar } from "@/components/public/navbar"
import { Footer } from "@/components/public/footer"
import { ScrollReveal } from "@/components/public/scroll-reveal"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <ScrollReveal>{children}</ScrollReveal>
      </main>
      <Footer />
    </div>
  )
}
