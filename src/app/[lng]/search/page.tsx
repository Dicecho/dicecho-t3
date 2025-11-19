"use client";

import { SearchContent } from "@/components/Search/SearchContent";
import { ScenarioCardSkeleton } from "@/components/Scenario/ScenarioCardSkeleton";
import { Suspense } from "react";

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="space-y-8">
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Loading...</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <ScenarioCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </div>}>
      <SearchContent />
    </Suspense>
  );
}
