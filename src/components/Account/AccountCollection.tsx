"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDicecho } from "@/hooks/useDicecho";
import { useTranslation } from "@/lib/i18n/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Empty } from "@/components/Empty";
import { CollectionDetail } from "@/components/Collection";
import { CollectionDetailSkeleton } from "@/components/Collection/collection-detail-skeleton";
import type { CollectionDto } from "@/types/collection";
import { Loader2 } from "lucide-react";
import { Trans } from "react-i18next";

type AccountCollectionProps = {
  userId: string;
  isSelf: boolean;
};

export const AccountCollection = ({
  userId,
  isSelf,
}: AccountCollectionProps) => {
  const { api } = useDicecho();
  const { t } = useTranslation();
  const [activeId, setActiveId] = useState<string>();

  const { data: collections, isLoading } = useQuery<CollectionDto[]>({
    queryKey: ["collection", "user", userId],
    queryFn: async () => {
      if (isSelf) {
        return api.collection.mine();
      }
      const res = await api.collection.list({
        creatorId: userId,
        pageSize: 100,
      });
      return res.data;
    },
    staleTime: 3600 * 1000,
  });

  useEffect(() => {
    if (!collections?.length) return;
    if (activeId) {
      const stillExists = collections.find((c) => c._id === activeId);
      if (stillExists) {
        return;
      }
    }
    const first = collections[0];
    if (first) {
      setActiveId(first._id);
    }
  }, [collections, activeId]);

  const {
    data: activeCollectionDetail,
    isLoading: isDetailLoading,
    isFetched: isDetailFetched,
  } = useQuery<CollectionDto>({
    queryKey: ["collection", "detail", activeId],
    queryFn: () => api.collection.detail(activeId!),
    enabled: Boolean(activeId),
  });

  return (
    <div className="grid gap-4 md:grid-cols-[280px_1fr]">
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            {isSelf ? t("collection_mine") : t("collection_theirs")}
          </CardTitle>
          <CardDescription>
            <div className="flex items-center gap-1">
              <Trans
                i18nKey="collection_total"
                t={t}
                values={{
                  count: collections?.length ?? "",
                }}
                components={{
                  loading: isLoading ? (
                    <Loader2 className="animate-spin" size={14} />
                  ) : (
                    <></>
                  ),
                }}
              />
            </div>
            {/* {t("collection_total", {
              count: collections?.length ?? 0,
              loading: isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <></>
              ),
            })} */}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {isLoading
            ? new Array(4)
                .fill(0)
                .map((_, i) => <Skeleton key={i} className="h-20 w-full" />)
            : collections?.map((collection) => (
                <button
                  key={collection._id}
                  type="button"
                  onClick={() => setActiveId(collection._id)}
                  className="group hover:border-primary focus-visible:ring-primary/50 data-[active=true]:border-primary data-[active=true]:bg-primary/5 rounded-lg border px-3 py-3 text-left transition-colors focus-visible:ring-2 focus-visible:outline-none"
                  data-active={collection._id === activeId}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{collection.name}</span>
                    <Badge
                      variant={
                        collection.accessLevel === "public"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {collection.accessLevel === "public"
                        ? t("collection_access_public")
                        : t("collection_access_private")}
                    </Badge>
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {t("collection_items_count", {
                      count: collection.items.length,
                    })}
                  </div>
                </button>
              ))}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4">
        {(isDetailLoading || !isDetailFetched) && <CollectionDetailSkeleton />}

        {activeCollectionDetail && (
          <CollectionDetail
            key={activeCollectionDetail._id}
            collection={activeCollectionDetail}
          />
        )}
      </div>
    </div>
  );
};
