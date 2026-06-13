import { Skeleton } from "@/components/ui/skeleton"

type AdminPageSkeletonProps = {
  tabs?: number
  cards?: number
}

export function AdminPageSkeleton({
  tabs = 0,
  cards = 2,
}: AdminPageSkeletonProps) {
  return (
    <div className="space-y-6" aria-label="Memuat halaman">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-3">
          <Skeleton className="h-8 w-64 max-w-full" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
        <Skeleton className="h-10 w-36" />
      </div>

      {tabs > 0 && (
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: tabs }).map((_, index) => (
            <Skeleton key={index} className="h-9 w-28" />
          ))}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-2">
        {Array.from({ length: cards }).map((_, index) => (
          <div key={index} className="space-y-5 rounded-xl border p-6">
            <div className="space-y-2">
              <Skeleton className="h-6 w-44" />
              <Skeleton className="h-4 w-72 max-w-full" />
            </div>
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-24 w-full" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Skeleton className="h-11 w-full" />
              <Skeleton className="h-11 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
