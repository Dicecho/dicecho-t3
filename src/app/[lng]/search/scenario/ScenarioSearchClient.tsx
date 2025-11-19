"use client";

import type { ModListApiResponse, ModFilterConfig, IModListQuery } from "@dicecho/types";
import { ScenarioSearchContent } from "@/components/Search/ScenarioSearchContent";
import { ScenarioCardSkeleton } from "@/components/Scenario/ScenarioCardSkeleton";
import { Suspense } from "react";

interface ScenarioSearchClientProps {
  lng: string;
  initialScenarios: ModListApiResponse;
  initialConfig: ModFilterConfig;
  initialQuery: Partial<IModListQuery>;
  keyword: string;
}

export function ScenarioSearchClient(props: ScenarioSearchClientProps) {
  return (
    <Suspense fallback={<div className="grid grid-cols-6 gap-8">
      <div className="col-span-6 md:col-span-4">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <ScenarioCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>}>
      <ScenarioSearchContent {...props} />
    </Suspense>
  );
}

