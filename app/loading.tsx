import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

export default function HomeLoading() {
  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Skeleton */}
      <section className="relative bg-linear-to-b from-primary/5 to-background pt-16 pb-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <Skeleton className="h-6 w-32 mx-auto mb-4" />
            <Skeleton className="h-16 w-full max-w-2xl mx-auto mb-4" />
            <Skeleton className="h-16 w-3/4 mx-auto mb-6" />
            <Skeleton className="h-20 w-full max-w-xl mx-auto mb-8" />
            <div className="flex justify-center gap-4">
              <Skeleton className="h-12 w-32" />
              <Skeleton className="h-12 w-32" />
            </div>
          </div>
        </div>
      </section>

      {/* Daily Verse Skeleton */}
      <section className="container">
        <Skeleton className="h-64 w-full rounded-2xl" />
      </section>

      {/* Features Grid Skeleton */}
      <section className="container">
        <div className="grid gap-8 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-12 w-12 rounded-full mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardFooter>
                <Skeleton className="h-10 w-32" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Recent Content Skeleton */}
      <section className="container">
        <div className="grid gap-12 lg:grid-cols-2">
          {[1, 2].map((col) => (
            <div key={col}>
              <div className="flex justify-between mb-6">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-8 w-24" />
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((row) => (
                  <Card key={row}>
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-32" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Skeleton */}
      <section className="container">
        <Skeleton className="h-64 w-full rounded-2xl" />
      </section>
    </div>
  )
}