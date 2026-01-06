import type { FC } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const ReplayItemSkeleton: FC = () => {
  return (
    <div className="overflow-hidden">
      <Skeleton className="mb-2 aspect-video w-full rounded-lg" />
      <Skeleton className="mb-1.5 h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="mt-1.5 flex items-center gap-2">
        <Skeleton className="h-5 w-5 rounded-full" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
};
