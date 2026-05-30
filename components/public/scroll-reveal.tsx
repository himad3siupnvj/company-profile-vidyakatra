"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

export function ScrollReveal({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current

    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return
    }

    const container = root

    const selector = [
      "section",
      "[data-scroll-reveal]",
      ".grid > a",
      ".grid > div",
      ".grid > article",
    ].join(",")

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return
          }

          entry.target.classList.add("is-visible")
          observer.unobserve(entry.target)
        })
      },
      {
        rootMargin: "0px 0px -12% 0px",
        threshold: 0.16,
      },
    )

    function registerRevealItems() {
      const revealItems = Array.from(container.querySelectorAll<HTMLElement>(selector))

      revealItems.forEach((item, index) => {
        if (item.dataset.revealRegistered === pathname) {
          return
        }

        item.dataset.revealRegistered = pathname
        item.classList.remove("is-visible")
        item.classList.add("scroll-reveal-item")
        item.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 55}ms`)
        observer.observe(item)
      })
    }

    registerRevealItems()

    const mutationObserver = new MutationObserver(registerRevealItems)
    mutationObserver.observe(container, {
      childList: true,
      subtree: true,
    })

    return () => {
      observer.disconnect()
      mutationObserver.disconnect()
    }
  }, [pathname])

  return (
    <div ref={rootRef} className="public-scroll-reveal">
      {children}
    </div>
  )
}
