"use client"

import { useState } from "react"
import { Check, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ShareArticleButtonProps = {
  title: string
  text: string
  path: string
  className?: string
}

export function ShareArticleButton({ title, text, path, className }: ShareArticleButtonProps) {
  const [copied, setCopied] = useState(false)

  async function handleShare() {
    const url = new URL(path, window.location.origin).toString()

    try {
      if (navigator.share) {
        await navigator.share({ title, text, url })
      } else {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        window.setTimeout(() => setCopied(false), 1800)
      }
    } catch {
      // Sharing can be cancelled by the user; keep the article view unchanged.
    }
  }

  return (
    <Button type="button" variant="outline" className={cn("gap-2 border-border/70", className)} onClick={handleShare}>
      {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
      {copied ? "Link tersalin" : "Share"}
    </Button>
  )
}
