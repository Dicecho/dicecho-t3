"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScenarioCardSkeleton } from "./ScenarioCardSkeleton";
import { useDicecho } from "@/hooks/useDicecho";
import { useTranslation } from "@/lib/i18n/react";
import { RelatedScenarioItem } from "./RelatedScenarioItem";

import type { IModListQuery, ModListApiResponse } from "@dicecho/types";

interface ScenarioRecommendListProps {
  scenarioId: string;
  tags: string[];
  moduleRule?: string;
  lng: string;
}

export function ScenarioRecommendList({
  scenarioId,
  tags,
  moduleRule,
  lng,
}: ScenarioRecommendListProps) {
  const { api } = useDicecho();
  const { t, i18n } = useTranslation(lng);

  const enabled = tags.length > 0 || !!moduleRule;

  const { data, isLoading } = useQuery<ModListApiResponse>({
    enabled,
    queryKey: [
      "scenario",
      scenarioId,
      "related",
      moduleRule,
      tags.slice(0, 5).join(","),
    ],
    queryFn: async () => {
      const query: Partial<IModListQuery> = {
        sort: { lastRateAt: -1 },
        pageSize: 6,
        page: 1,
      };
      if (moduleRule) {
        query.filter = { moduleRule };
      }
      if (tags.length > 0) {
        query.tags = tags.slice(0, 5);
      }
      const res = await api.module.list(query);
      const filtered = res.data.filter((item) => item._id !== scenarioId);
      return { ...res, data: filtered };
    },
    staleTime: 10 * 60 * 1000,
  });

  const content = useMemo(() => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 2 }).map((_, idx) => (
            <ScenarioCardSkeleton key={idx} />
          ))}
        </div>
      );
    }
    if (!data || data.data.length === 0) return null;
    return (
      <div className="space-y-3">
        {data.data.map((item) => (
          <Link
            key={item._id}
            href={`/${i18n.language}/scenario/${item._id}`}
            prefetch
          >
            <RelatedScenarioItem scenario={item} />
          </Link>
        ))}
      </div>
    );
  }, [data, i18n.language, isLoading]);

  if (!enabled) return null;
  if (!isLoading && (!data || data.data.length === 0)) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="capitalize">{t("scenario_related_recommendation")}</CardTitle>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
}
