import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="container py-16 md:py-24" aria-busy="true" aria-label="A carregar">
      <Skeleton className="mb-8 h-4 w-48" />
      <div className="max-w-3xl space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-11/12" />
        <Skeleton className="h-10 w-2/3" />
      </div>
      <Skeleton className="mt-8 h-5 w-40" />
      <div className="mt-24 grid gap-10 md:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-7 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        ))}
      </div>
    </div>
  )
}
