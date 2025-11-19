import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function TopicCardSkeleton() {
  return (
    <Card>
      <div className="p-4">
        <div className="mb-3 flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex-1">
            <Skeleton className="mb-1 h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>

        <Skeleton className="mb-2 h-6 w-full" />
        <Skeleton className="mb-1 h-4 w-full" />
        <Skeleton className="mb-1 h-4 w-full" />
        <Skeleton className="mb-4 h-4 w-3/4" />

        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </Card>
  );
}

