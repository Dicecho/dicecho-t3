"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDicecho } from "@/hooks/useDicecho";
import { useTranslation } from "@/lib/i18n/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Empty } from "@/components/Empty";
import { ScenarioCard } from "@/components/Scenario/ScenarioCard";

type AccountCollectionProps = {
  userId: string;
  isSelf: boolean;
};

export const AccountCollection = ({ userId, isSelf }: AccountCollectionProps) => {
  const { api } = useDicecho();
  const { t, i18n } = useTranslation();
  const [activeId, setActiveId] = useState<string>();

  const { data: collections, isLoading } = useQuery({
    queryKey: ["collection", isSelf ? "mine" : userId],
    queryFn: async () => {
      if (isSelf) {
        return api.collection.mine();
      }
      const res = await api.collection.list({ creatorId: userId, pageSize: 100 });
      return res.data;
    },
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

  const activeCollection = useMemo(() => {
    return collections?.find((collection) => collection._id === activeId);
  }, [collections, activeId]);

  const {
    data: items,
    isLoading: isItemsLoading,
  } = useQuery({
    queryKey: ["collection", "items", activeId],
    queryFn: () => api.collection.items(activeId!),
    enabled: Boolean(activeId),
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("collection")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!collections || collections.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("collection")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Empty>
            <div className="text-muted-foreground">
              {isSelf ? t("collection_empty_self") : t("collection_empty_other")}
            </div>
          </Empty>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-[280px_1fr]">
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            {isSelf ? t("collection_mine") : t("collection_theirs")}
          </CardTitle>
          <CardDescription>{t("collection_total", { count: collections.length })}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {collections.map((collection) => (
            <button
              key={collection._id}
              type="button"
              onClick={() => setActiveId(collection._id)}
              className="group rounded-lg border px-3 py-3 text-left transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 data-[active=true]:border-primary data-[active=true]:bg-primary/5"
              data-active={collection._id === activeId}
            >
              <div className="flex items-center gap-2">
                <span className="font-medium">{collection.name}</span>
                <Badge variant={collection.accessLevel === "public" ? "secondary" : "outline"}>
                  {collection.accessLevel === "public"
                    ? t("collection_access_public")
                    : t("collection_access_private")}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                {t("collection_items_count", { count: collection.items.length })}
              </div>
            </button>
          ))}
        </CardContent>
      </Card>

      {activeCollection && (
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle>{activeCollection.name}</CardTitle>
                <Badge variant={activeCollection.accessLevel === "public" ? "secondary" : "outline"}>
                  {activeCollection.accessLevel === "public"
                    ? t("collection_access_public")
                    : t("collection_access_private")}
                </Badge>
              </div>
              <CardDescription>
                {t("collection_created_at", {
                  date: new Intl.DateTimeFormat(i18n.language, {
                    dateStyle: "medium",
                  }).format(new Date(activeCollection.createdAt)),
                })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {activeCollection.description ? (
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {activeCollection.description}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {t("collection_no_description")}
                </p>
              )}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span>{t("collection_favorite_count", { count: activeCollection.favoriteCount })}</span>
                <span>{t("collection_comment_count", { count: activeCollection.commentCount })}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{t("collection_items_title")}</CardTitle>
                  <CardDescription>
                    {t("collection_items_count", { count: items?.length ?? 0 })}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isItemsLoading ? (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton key={index} className="aspect-[3/4] w-full rounded-lg" />
                  ))}
                </div>
              ) : items && items.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {items.map((mod) => (
                    <ScenarioCard key={mod._id} scenario={mod} />
                  ))}
                </div>
              ) : (
                <Empty>
                  <div className="text-muted-foreground">{t("collection_items_empty")}</div>
                </Empty>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

