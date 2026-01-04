"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDicecho } from "@/hooks/useDicecho";
import { useTranslation } from "@/lib/i18n/react";
import { RelatedScenarioItem } from "./related-scenario-item";

import type { ModListApiResponse } from "@dicecho/types";

interface AuthorWorksProps {
  scenarioId: string;
}

function AuthorWorksSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: 3 }).map((_, idx) => (
        <div key={idx} className="py-2">
          <div className="mb-1 flex items-center">
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="ml-2 h-4 w-8" />
          </div>
          <div className="flex items-center">
            <Skeleton className="mr-2 h-5 w-5 rounded-full" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function AuthorWorks({ scenarioId }: AuthorWorksProps) {
  const { api } = useDicecho();
  const { t, i18n } = useTranslation();

  const { data, isLoading } = useQuery({
    queryKey: ["scenario", scenarioId, "related"],
    queryFn: () => api.module.related(scenarioId),
    staleTime: 10 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <Card className="gap-0 p-4">
        <div className="mb-3 text-base font-semibold">{t("scenario_author_other_works")}</div>
        <AuthorWorksSkeleton />
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <Card className="gap-0 p-4">
      <div className="mb-3 text-base font-semibold">{t("scenario_author_other_works")}</div>
      <div>
        {data.slice(0, 5).map((item) => (
          <Link
            key={item._id}
            href={`/${i18n.language}/scenario/${item._id}`}
            prefetch
          >
            <RelatedScenarioItem scenario={item} />
          </Link>
        ))}
      </div>
    </Card>
  );
}
