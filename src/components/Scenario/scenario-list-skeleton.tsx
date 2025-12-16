import { ScenarioCardSkeleton } from "@/components/Scenario/ScenarioCardSkeleton";
import { ScenarioListHeader } from "@/components/Scenario/scenario-list-header";
import { IModListQuery } from "@dicecho/types";

interface ScenarioListSkeletonProps {
  count?: number;
  query?: Partial<IModListQuery>;
}

export async function ScenarioListSkeleton({
  query,
  count = 12,
}: ScenarioListSkeletonProps) {
  return (
    <>
      <ScenarioListHeader query={query} />
      <div className="grid grid-cols-3 gap-8 md:grid-cols-4 lg:grid-cols-5">
        {new Array(count).fill(0).map((_, index) => (
          <ScenarioCardSkeleton key={index} />
        ))}
      </div>
    </>
  );
}
