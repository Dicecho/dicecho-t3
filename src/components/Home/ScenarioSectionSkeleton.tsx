import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScenarioCardSkeleton } from "@/components/Scenario/ScenarioCardSkeleton";

interface ScenarioSectionSkeletonProps {
  className?: string;
}

export function ScenarioSectionSkeleton({ className }: ScenarioSectionSkeletonProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-8 w-16" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <ScenarioCardSkeleton key={i} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
