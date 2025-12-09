import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function ScenarioDetailSkeleton() {
  return (
    <div className="md:container">
      {/* Mobile cover image */}
      <div className="relative h-[280px] w-full bg-muted md:hidden" />

      <Card className="relative mt-[-16px] rounded-t-2xl p-4 md:mt-10 md:flex md:flex-row">
        {/* Desktop cover image */}
        <div className="-mt-[40px] mr-[24px] hidden aspect-3/4 w-32 md:block">
          <Skeleton className="h-full w-full rounded-md" />
        </div>

        <div className="flex flex-1 flex-col">
          {/* Title */}
          <Skeleton className="mb-2 h-8 w-3/4" />

          {/* Quote notice */}
          <Skeleton className="mb-2 h-4 w-1/2" />

          {/* Desktop actions */}
          <div className="mt-auto hidden w-full flex-wrap gap-2 md:flex">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        {/* Mobile rate info */}
        <div className="mt-4 w-full md:hidden">
          <Skeleton className="h-24 w-full" />
        </div>

        {/* Desktop rating section */}
        <div className="ml-4 hidden min-w-40 flex-col gap-2 border-l border-solid pl-4 md:flex">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-12 w-20" />
          <Skeleton className="h-6 w-full" />
        </div>
      </Card>

      {/* Content sections */}
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          {/* Description card */}
          <Card className="p-4">
            <Skeleton className="mb-4 h-6 w-32" />
            <Skeleton className="mb-2 h-4 w-full" />
            <Skeleton className="mb-2 h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </Card>

          {/* Rates card */}
          <Card className="p-4">
            <Skeleton className="mb-4 h-6 w-32" />
            <div className="space-y-2">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card className="p-4">
            <Skeleton className="mb-4 h-6 w-24" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </Card>

          <Card className="p-4">
            <Skeleton className="mb-4 h-6 w-32" />
            <div className="grid grid-cols-2 gap-2">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
