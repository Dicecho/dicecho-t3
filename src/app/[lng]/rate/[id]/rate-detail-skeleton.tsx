import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function RateDetailSkeleton() {
  return (
    <div className="md:container grid grid-cols-6 gap-8">
      <div className="col-span-6 md:col-span-4">
        <div className="pb-16 pt-16 md:pb-0 md:pt-4">
          {/* Rate Card */}
          <Card className="max-md:rounded-none p-0">
            <CardContent className="p-4 md:p-6">
              {/* User info */}
              <div className="flex items-center gap-2 mb-4">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="ml-auto h-4 w-20" />
              </div>

              {/* Scenario widget */}
              <Skeleton className="h-16 w-full mb-4 rounded" />

              {/* Rating stars */}
              <Skeleton className="h-5 w-32 mb-4" />

              {/* Badges */}
              <div className="flex gap-2 mb-4">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>

              {/* Content */}
              <div className="space-y-2 mb-4">
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
          <div className="mt-2 md:mt-6 mb-4">
            <Card className="max-md:rounded-none p-0">
              <CardContent className="p-4 md:p-6">
                {/* Comment header */}
                <div className="flex items-center justify-between mb-4">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-8 w-24" />
                </div>

                {/* Comment composer */}
                <Skeleton className="h-20 w-full mb-4 hidden md:block" />

                {/* Comments list */}
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-3">
                      <Skeleton className="h-8 w-8 rounded-full shrink-0" />
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
      </div>
    </div>
  );
}
