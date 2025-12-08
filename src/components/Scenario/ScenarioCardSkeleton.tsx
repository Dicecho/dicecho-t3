import { Skeleton } from "@/components/ui/skeleton";

export function ScenarioCardSkeleton() {
  return (
    <div className="card group flex flex-col gap-2">
      <div className="flex aspect-[3/4] relative rounded-lg overflow-hidden">
        <Skeleton className="w-full h-full" />
      </div>
      <Skeleton className="w-full h-4" />

      <div className="flex items-center gap-2">
        <Skeleton className="w-4 h-4 rounded-full" />
        <Skeleton className="w-16 h-4" />
      </div>

      <div className="w-full flex items-center justify-between">
        <Skeleton className="w-20 h-4" />
        <Skeleton className="w-8 h-4" />
      </div>
    </div>
  );
};
