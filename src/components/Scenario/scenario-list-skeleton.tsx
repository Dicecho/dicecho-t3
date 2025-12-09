import { ScenarioCardSkeleton } from "@/components/Scenario/ScenarioCardSkeleton";
import { Separator } from "@/components/ui/separator";

interface ScenarioListSkeletonProps {
  count?: number;
}

export function ScenarioListSkeleton({ count = 12 }: ScenarioListSkeletonProps) {
  return (
    <>
      <div className="text-muted-foreground mt-2 flex items-center gap-2 text-sm">
        <div className="h-4 w-32 animate-pulse rounded bg-muted" />
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
