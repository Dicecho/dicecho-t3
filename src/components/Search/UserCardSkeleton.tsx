import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function UserCardSkeleton() {
  return (
    <Card>
      <div className="flex items-center gap-4 p-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex-1">
          <Skeleton className="mb-2 h-5 w-32" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    </Card>
  );
}

