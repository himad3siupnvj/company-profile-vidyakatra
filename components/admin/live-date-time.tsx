"use client"

import { useEffect, useState } from "react"

const dateTimeFormatter = new Intl.DateTimeFormat("id-ID", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  timeZone: "Asia/Jakarta",
  timeZoneName: "short",
})

export function LiveDateTime() {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())

    const interval = window.setInterval(() => setNow(new Date()), 1000)

    return () => window.clearInterval(interval)
  }, [])

  return <span>{now ? dateTimeFormatter.format(now) : "Memuat waktu..."}</span>
}
