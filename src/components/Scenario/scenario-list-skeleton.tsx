import { ScenarioCardSkeleton } from "@/components/Scenario/ScenarioCardSkeleton";
import { Separator } from "@/components/ui/separator";
import { ScenarioSort } from "./scenario-sort";
import { Skeleton } from "@/components/ui/skeleton";

interface ScenarioListSkeletonProps {
  count?: number;
}

export async function ScenarioListSkeleton({
  count = 12,
}: ScenarioListSkeletonProps) {
  return (
    <>
      <div className="flex items-center gap-2 text-sm">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-32" />
        </div>
        <ScenarioSort className="ml-auto" />
      </div>
      <Separator className="mt-2 mb-4" />
      <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4">
        {new Array(count).fill(0).map((_, index) => (
          <ScenarioCardSkeleton key={index} />
        ))}
      </div>
    </>
  );
}
