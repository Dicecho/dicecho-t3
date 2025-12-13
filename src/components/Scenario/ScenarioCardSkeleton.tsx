import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function ScenarioCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("card group flex flex-col gap-2", className)}>
      <div className="relative flex aspect-[3/4] overflow-hidden rounded-lg">
        <Skeleton className="h-full w-full" />
      </div>
      <Skeleton className="h-4 w-full" />

      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-16" />
      </div>

      <div className="flex w-full items-center justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-8" />
      </div>
    </div>
  );
}
