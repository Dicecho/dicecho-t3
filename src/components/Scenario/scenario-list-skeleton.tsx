import { ScenarioCardSkeleton } from "@/components/Scenario/ScenarioCardSkeleton";
import { Separator } from "@/components/ui/separator";
import { ScenarioSort } from "./scenario-sort";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "../ui/button";
import { FilterIcon } from "lucide-react";
import { ScenarioListHeader } from "@/components/Scenario/scenario-list-header";

interface ScenarioListSkeletonProps {
  count?: number;
}

export async function ScenarioListSkeleton({
  count = 12,
}: ScenarioListSkeletonProps) {
  return (
    <>
      <ScenarioListHeader />
      <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4">
        {new Array(count).fill(0).map((_, index) => (
          <ScenarioCardSkeleton key={index} />
        ))}
      </div>
    </>
  );
}
