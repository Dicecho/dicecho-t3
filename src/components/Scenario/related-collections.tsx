"use client";

import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CollectionItem } from "@/components/Collection/collection-item";
import { useDicecho } from "@/hooks/useDicecho";
import { useTranslation } from "@/lib/i18n/react";

import type { CollectionListResponse, CollectionSortKey } from "@/types/collection";

interface RelatedCollectionsProps {
  scenarioId: string;
}

function CollectionsSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 2 }).map((_, idx) => (
        <div key={idx} className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function RelatedCollections({ scenarioId }: RelatedCollectionsProps) {
  const { api } = useDicecho();
  const { t } = useTranslation();

  const { data, isLoading } = useQuery<CollectionListResponse>({
    queryKey: ["scenario", scenarioId, "collections"],
    queryFn: () =>
      api.collection.list({
        targetName: "Mod",
        targetId: scenarioId,
        sort: { favoriteCount: -1 } as Partial<Record<CollectionSortKey, -1 | 1>>,
        pageSize: 5,
        page: 1,
      }),
    staleTime: 10 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <Card className="gap-0 p-4">
        <div className="mb-3 text-base font-semibold">{t("scenario_related_collections")}</div>
        <CollectionsSkeleton />
      </Card>
    );
  }

  if (!data || data.data.length === 0) {
    return null;
  }

  return (
    <Card className="gap-0 p-4">
      <div className="mb-3 text-base font-semibold">{t("scenario_related_collections")}</div>
      <div className="flex flex-col gap-2">
        {data.data.map((collection) => (
          <CollectionItem key={collection._id} collection={collection} />
        ))}
      </div>
    </Card>
  );
}
