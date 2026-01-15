import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { MobileFooter } from "@/components/Footer";
import { CollectionDetailHeader } from "./header";

export default function Loading() {
  return (
    <>
      <CollectionDetailHeader title="" />
      <div className="md:container md:py-6 max-md:pb-24">
        <div className="space-y-4">
          {/* Collection Header Card */}
          <Card className="relative max-md:rounded-none max-md:border-0 max-md:bg-transparent max-md:shadow-none max-md:pt-18">
            <CardContent className="flex w-full flex-col gap-4 md:flex-row">
              {/* Cover Image */}
              <div className="flex gap-4 md:contents">
                <Skeleton className="h-[120px] w-[120px] shrink-0 rounded-md md:h-40 md:w-40" />

                {/* Mobile: Title and basic info next to cover */}
                <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 md:hidden">
                  <Skeleton className="h-6 w-3/4" />
                  <div className="flex items-center gap-1.5">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="mt-2 h-8 w-28 rounded-full" />
                </div>
              </div>

              {/* Desktop: Main info area */}
              <div className="hidden flex-1 space-y-2 md:block">
                <Skeleton className="h-8 w-2/3" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <Skeleton className="h-8 w-24 rounded-full" />
                  <Skeleton className="h-8 w-16 rounded-full" />
                </div>
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>

              {/* Mobile: Stats and description below cover */}
              <div className="space-y-2 md:hidden">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </CardContent>
          </Card>

          {/* Tabs Card */}
          <Card className="max-md:rounded-none">
            <CardContent className="px-4">
              {/* Tab buttons */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex gap-1 rounded-lg bg-muted p-1 max-md:flex-1">
                  <Skeleton className="h-8 flex-1 rounded-md md:w-24" />
                  <Skeleton className="h-8 flex-1 rounded-md md:w-24" />
                </div>
              </div>

              {/* Items list skeleton */}
              <div className="mt-4 space-y-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex gap-4">
                    <Skeleton className="h-32 w-24 flex-none rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-2/3" />
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <MobileFooter />
    </>
  );
}
