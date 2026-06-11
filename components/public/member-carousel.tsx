"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import type { UnitMember } from "@/lib/public-content"

type MemberCarouselProps = {
  members: UnitMember[]
}

const autoplayDelayMs = 3500

export function MemberCarousel({ members }: MemberCarouselProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [isPaused, setIsPaused] = useState(false)
  const slides = members.length > 1 && members.length < 6 ? [...members, ...members] : members

  useEffect(() => {
    if (!api || members.length < 2 || isPaused) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const intervalId = window.setInterval(() => api.scrollNext(), autoplayDelayMs)

    return () => window.clearInterval(intervalId)
  }, [api, isPaused, members.length])

  return (
    <Carousel
      opts={{ align: "start", loop: members.length > 1 }}
      setApi={setApi}
      className="mx-auto w-full sm:max-w-[38rem]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsPaused(false)
        }
      }}
      onPointerDown={() => setIsPaused(true)}
      onPointerUp={() => setIsPaused(false)}
      onPointerCancel={() => setIsPaused(false)}
    >
      <CarouselContent className="-ml-3 sm:-ml-4">
        {slides.map((member, index) => (
          <CarouselItem
            key={`${member.name}-${index}`}
            className="basis-[72%] pl-3 min-[480px]:basis-[48%] sm:basis-[14rem] sm:pl-4"
          >
            <Card className="group h-full gap-0 overflow-hidden border-border/50 bg-card py-0 transition-colors hover:border-primary/40">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  sizes="(max-width: 479px) 72vw, (max-width: 639px) 48vw, 224px"
                  className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </div>
              <CardContent className="min-h-24 p-3 sm:p-4">
                <h3 className="text-sm font-semibold leading-snug sm:text-base">{member.name}</h3>
                <p className="mt-1 text-xs leading-relaxed text-primary sm:text-sm">{member.role}</p>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      {members.length > 1 && (
        <>
          <CarouselPrevious className="-top-12 left-auto right-11 translate-y-0" />
          <CarouselNext className="-top-12 right-0 translate-y-0" />
        </>
      )}
    </Carousel>
  )
}
