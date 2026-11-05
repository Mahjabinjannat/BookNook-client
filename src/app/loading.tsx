import { BookOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

function BookCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#e0e8df] bg-white shadow-sm">
      {/* Book image */}
      <div className="bg-[#edf2eb] p-4">
        <Skeleton className="aspect-[4/3] w-full rounded-xl bg-[#dce8d9]" />
      </div>

      {/* Book details */}
      <div className="space-y-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <Skeleton className="h-5 w-20 rounded-full bg-[#e4ece1]" />
          <Skeleton className="h-5 w-24 rounded-full bg-[#e4ece1]" />
        </div>

        <div className="space-y-3">
          <Skeleton className="h-6 w-4/5 bg-[#dce8d9]" />
          <Skeleton className="h-4 w-3/5 bg-[#e4ece1]" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-3 w-full bg-[#edf1ea]" />
          <Skeleton className="h-3 w-5/6 bg-[#edf1ea]" />
        </div>

        <Skeleton className="mt-4 h-11 w-full rounded-xl bg-[#dce8d9]" />
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <main
      className="min-h-screen w-full bg-[#f8faf6]"
      aria-label="Loading BookNook content"
      aria-busy="true"
    >
      {/* Page heading skeleton */}
      <section className="border-b border-[#dce6dc] bg-[#eaf2e8]">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#dbe9d9]">
              <BookOpen className="size-5 text-[#1d513b]" />
            </div>

            <Skeleton className="h-4 w-36 bg-[#cfdfcb]" />
          </div>

          <Skeleton className="h-10 w-64 max-w-full bg-[#cfdfcb] sm:h-12 sm:w-96" />

          <Skeleton className="mt-5 h-4 w-full max-w-lg bg-[#d8e5d4]" />

          <Skeleton className="mt-2 h-4 w-3/4 max-w-sm bg-[#d8e5d4]" />
        </div>
      </section>

      {/* Main content */}
      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-6 sm:py-14 lg:px-8">
        {/* Section title */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="space-y-3">
            <Skeleton className="h-7 w-48 bg-[#dce8d9]" />
            <Skeleton className="h-4 w-64 max-w-full bg-[#e5ece2]" />
          </div>

          <Skeleton className="h-10 w-28 rounded-xl bg-[#e0e9dc]" />
        </div>

        {/* Search and filter skeletons */}
        <div className="mb-8 grid gap-4 rounded-2xl border border-[#e0e8df] bg-white p-5 sm:grid-cols-2 lg:grid-cols-[1fr_220px_220px]">
          <Skeleton className="h-11 w-full rounded-xl bg-[#e9eee6]" />
          <Skeleton className="h-11 w-full rounded-xl bg-[#e9eee6]" />
          <Skeleton className="h-11 w-full rounded-xl bg-[#e9eee6]" />
        </div>

        {/* Category placeholders */}
        <div className="mb-8 flex flex-wrap gap-3">
          {[90, 110, 85, 105, 75].map((width, index) => (
            <Skeleton
              key={index}
              className="h-9 rounded-full bg-[#e1eade]"
              style={{ width }}
            />
          ))}
        </div>

        {/* Book card skeleton grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <BookCardSkeleton key={index} />
          ))}
        </div>

        {/* Loading message */}
        <div className="mt-12 flex items-center justify-center gap-3">
          <div className="size-4 animate-spin rounded-full border-2 border-[#cbdcca] border-t-[#1d513b]" />

          <p className="text-sm font-medium text-[#718575]">
            Preparing your next reading adventure...
          </p>
        </div>
      </section>
    </main>
  );
}
