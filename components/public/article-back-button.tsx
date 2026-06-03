"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

type ArticleBackButtonProps = {
  fallbackHref?: string
}

export function ArticleBackButton({ fallbackHref = "/berita" }: ArticleBackButtonProps) {
  const router = useRouter()

  function handleBack() {
    if (window.history.length > 1) {
      router.back()
      return
    }

    router.push(fallbackHref)
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="-ml-2 h-9 gap-2 px-2 text-muted-foreground hover:bg-primary/10 hover:text-primary"
      onClick={handleBack}
    >
      <ArrowLeft className="h-4 w-4" />
      Kembali
    </Button>
  )
}
