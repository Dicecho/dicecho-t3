"use client";
import { RateSortKey, RateType } from "@dicecho/types";
import { RateList } from "@/components/Rate/RateList";
import { RateFilter } from "@/components/Rate/RateFilter";
import { useLocalStorage } from "@/hooks/useLocalStorage";

import type { IRateListQuery } from "@dicecho/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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

  return (
    <Card>
      <CardHeader>
        <RateFilter
          rateCount={rateCount}
          markCount={markCount}
          query={query}
          onChange={(value) => setStoredQuery(value)}
        />
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
