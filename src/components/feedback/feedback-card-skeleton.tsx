import { Skeleton } from "@/components/ui/skeleton";

export function FeedbackCardSkeleton() {
  return (
    <div className="border-b border-border px-4 py-3">
      <div className="flex items-start gap-3">
        <Skeleton className="mt-1 h-4 w-4 shrink-0" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-4 w-12 rounded-full" />
            <Skeleton className="h-4 w-16 rounded-full" />
          </div>
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    </div>
  );
}

export function FeedbackListSkeleton() {
  return (
    <div className="divide-y divide-border rounded-lg border border-border bg-card">
      {Array.from({ length: 5 }).map((_, i) => (
        <FeedbackCardSkeleton key={i} />
      ))}
    </div>
  );
}
