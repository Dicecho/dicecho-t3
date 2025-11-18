"use client";
import { RateSortKey, RateType } from "@dicecho/types";
import { RateList } from "@/components/Rate/RateList";
import { RateFilter } from "@/components/Rate/RateFilter";
import { useLocalStorage } from "@/hooks/useLocalStorage";

import type { IRateListQuery } from "@dicecho/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Empty } from "@/components/Empty";

const DEFAULT_QUERY: Partial<IRateListQuery> = {
  filter: { type: RateType.Rate },
  sort: { [RateSortKey.RATE_AT]: -1 },
};

export const AccountRateList = ({
  userId,
}: {
  userId: string;
}) => {
  const [query, setQuery] = useLocalStorage<
    Pick<Partial<IRateListQuery>, "filter" | "sort">
  >("@userRateListQuery", DEFAULT_QUERY);

  const rateQuery: Partial<IRateListQuery> = {
    ...query,
    userId,
  };

  return (
    <Card>
      <CardHeader>
        <RateFilter
          query={query}
          onChange={(query) => setQuery(query)}
        />
      </CardHeader>
      <CardContent>
        <RateList query={rateQuery} emptyPlaceholder={(
          <Empty>
            <div className="text-muted-foreground">
              {query.filter?.type === RateType.Mark ? "暂无想玩" : "暂无评价"}
            </div>
          </Empty>
        )} />
      </CardContent>
    </Card>
  );
};
