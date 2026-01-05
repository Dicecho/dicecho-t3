"use client";
import { useMemo } from "react";
import { RateSortKey, RateType } from "@dicecho/types";
import { RateList } from "@/components/Rate/RateList";
import { RateTypeTabs } from "@/components/Rate/rate-type-tabs";
import { RateSortSelect } from "@/components/Rate/rate-sort-select";
import { RateFilterSelector } from "@/components/Rate/rate-filter-selector";
import { RateFilterDrawer } from "@/components/Rate/rate-filter-drawer";
import { useLocalStorage } from "@/hooks/useLocalStorage";

import type { IRateListQuery } from "@dicecho/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FilterIcon } from "lucide-react";
import { Empty } from "@/components/Empty";
import { useTranslation } from "@/lib/i18n/react";

const DEFAULT_QUERY: Pick<Partial<IRateListQuery>, "filter" | "sort"> = {
  filter: { type: RateType.Rate },
  sort: { [RateSortKey.RATE_AT]: -1 },
};

type AccountRateListProps = {
  userId: string;
  storageKey?: string;
  defaultQuery?: Pick<Partial<IRateListQuery>, "filter" | "sort">;
  rateCount?: number;
  markCount?: number;
};

export const AccountRateList = ({
  userId,
  storageKey = "@userRateListQuery",
  defaultQuery = DEFAULT_QUERY,
  rateCount,
  markCount,
}: AccountRateListProps) => {
  const { t } = useTranslation();
  const [storedQuery, setStoredQuery] = useLocalStorage<
    Pick<Partial<IRateListQuery>, "filter" | "sort">
  >(storageKey, defaultQuery);

  const query: Pick<Partial<IRateListQuery>, "filter" | "sort"> = {
    filter: {
      ...defaultQuery.filter,
      ...(storedQuery?.filter ?? {}),
    },
    sort: {
      ...defaultQuery.sort,
      ...(storedQuery?.sort ?? {}),
    },
  };

  const rateQuery: Partial<IRateListQuery> = {
    ...query,
    userId,
  };

  const filterCount = useMemo(() => {
    let count = 0;
    if (query.filter?.remarkLength) count++;
    if (query.filter?.rate) count++;
    if (query.filter?.view != null) count++;
    return count;
  }, [query.filter]);

  return (
    <Card>
      <CardHeader>
        <div className="flex md:flex-row flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <RateTypeTabs
              className="max-md:flex-1"
              value={(query.filter?.type ?? RateType.Rate) as RateType}
              onChange={(type) =>
                setStoredQuery({ ...query, filter: { ...query.filter, type } })
              }
              rateCount={rateCount}
              markCount={markCount}
            />
          </div>
          <div className="flex items-center gap-2 flex-1">
            <RateFilterDrawer
              filter={query.filter ?? {}}
              onChange={(filter) => setStoredQuery({ ...query, filter })}
            >
              <Button
                className="relative md:hidden ml-auto"
                variant="outline"
                size="icon"
              >
                <FilterIcon size={16} />
                {filterCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full px-1 font-mono text-xs tabular-nums">
                    {filterCount}
                  </Badge>
                )}
              </Button>
            </RateFilterDrawer>

            <RateFilterSelector
              className="flex-1 max-md:hidden ml-auto"
              filter={query.filter ?? {}}
              onChange={(filter) => setStoredQuery({ ...query, filter })}
            />

            <RateSortSelect
              value={query.sort}
              onChange={(sort) => setStoredQuery({ ...query, sort })}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <RateList
          query={rateQuery}
          emptyPlaceholder={
            <Empty>
              <div className="text-muted-foreground">
                {query.filter?.type === RateType.Mark
                  ? t("mark_list_empty")
                  : t("rate_list_empty")}
              </div>
            </Empty>
          }
        />
      </CardContent>
    </Card>
  );
};
