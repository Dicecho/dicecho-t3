import { ScenarioCardSkeleton } from "@/components/Scenario/ScenarioCardSkeleton";

export default function TagDetailLoading() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <ScenarioCardSkeleton key={i} />
      ))}
    </div>
  );
}
