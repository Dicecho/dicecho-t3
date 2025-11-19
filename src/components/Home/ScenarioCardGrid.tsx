"use client";
import Link from "next/link";
import { FC } from "react";
import { ScenarioCard } from "@/components/Scenario/ScenarioCard";
import { ScenarioCardSkeleton } from "@/components/Scenario/ScenarioCardSkeleton";
import type { IModDto } from "@dicecho/types";
import { cn } from "@/lib/utils";

interface ScenarioCardGridProps {
  scenarios: IModDto[];
  lng: string;
  loading?: boolean;
  className?: string;
}

export const ScenarioCardGrid: FC<ScenarioCardGridProps> = ({
  scenarios,
  lng,
  loading = false,
  className,
}) => {
  if (loading) {
    return (
      <div className={cn("grid grid-cols-2 gap-4 md:grid-cols-4", className)}>
        {new Array(8).fill(0).map((_, index) => (
          <ScenarioCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-2 gap-4 md:grid-cols-4", className)}>
      {scenarios.map((scenario) => (
        <Link
          href={`/${lng}/scenario/${scenario._id}`}
          key={scenario._id}
        >
          <ScenarioCard scenario={scenario} />
        </Link>
      ))}
    </div>
  );
};

