import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function TagCardSkeleton() {
  return (
    <Card>
      <div className="overflow-hidden">
        <Skeleton className="h-24 w-full" />
        <div className="p-4">
          <Skeleton className="mb-2 h-6 w-3/4" />
          <Skeleton className="mb-4 h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <div className="mt-4 flex items-center justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      </div>
    </Card>
  );
}

