import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function RateDetailSkeleton() {
  return (
    <div className="pt-16 pb-16 md:pt-4 md:pb-0">
      {/* Rate Card */}
      <Card className="p-0 max-md:rounded-none">
        <CardContent className="p-4 md:p-6">
          {/* User info */}
          <div className="mb-4 flex items-center gap-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="ml-auto h-4 w-20" />
          </div>

          {/* Scenario widget */}
          <Skeleton className="mb-4 h-16 w-full rounded" />

          {/* Rating stars */}
          <Skeleton className="mb-4 h-5 w-32" />

          {/* Badges */}
          <div className="mb-4 flex gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>

          {/* Content */}
          <div className="mb-4 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-10" />
            <Skeleton className="h-8 w-10" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-20" />
          </div>
        </CardContent>
      </Card>

      {/* Comments Card */}
      <div className="mt-2 mb-4 md:mt-6">
        <Card className="p-0 max-md:rounded-none">
          <CardContent className="p-4 md:p-6">
            {/* Comment header */}
            <div className="mb-4 flex items-center justify-between">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-8 w-24" />
            </div>

            {/* Comment composer */}
            <Skeleton className="mb-4 hidden h-20 w-full md:block" />

            {/* Comments list */}
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
