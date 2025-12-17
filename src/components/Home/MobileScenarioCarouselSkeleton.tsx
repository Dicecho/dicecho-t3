import { Skeleton } from "@/components/ui/skeleton";
import { ScenarioCardSkeleton } from "@/components/Scenario/ScenarioCardSkeleton";

interface MobileScenarioCarouselSkeletonProps {
  title?: boolean;
}

export function MobileScenarioCarouselSkeleton({ title = true }: MobileScenarioCarouselSkeletonProps) {
  return (
    <div>
      {title && (
        <div className="flex items-center justify-between mb-3 px-4">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-8 w-16" />
        </div>
      )}
      <div className="flex gap-4 overflow-hidden pl-4">
        {[1, 2, 3, 4].map((i) => (
          <ScenarioCardSkeleton key={i} className="w-[28.57%] shrink-0" />
        ))}
      </div>
    </div>
  );
}
