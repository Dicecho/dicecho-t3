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
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, FilterIcon } from "lucide-react";
import { useTranslation } from "@/lib/i18n/react";
import { RateEditDialog } from "@/components/Rate";

const DEFAULT_QUERY: Partial<IRateListQuery> = {
  filter: { type: RateType.Rate, remarkLength: { $gt: 1 } },
  sort: { [RateSortKey.RATE_AT]: -1 },
};

type ScenarioRateListProps = {
  scenarioId: string;
  rateCount?: number;
  markCount?: number;
} & React.ComponentProps<"div">;

export const ScenarioRateList = ({
  scenarioId,
  rateCount = 0,
  markCount = 0,
  ...props
}: ScenarioRateListProps) => {
  const { t } = useTranslation();
  const [query, setQuery] = useLocalStorage<
    Pick<Partial<IRateListQuery>, "filter" | "sort">
  >("@rateListQuery", DEFAULT_QUERY);

  const rateQuery: Partial<IRateListQuery> = {
    ...query,
    modId: scenarioId,
  };

  const filterCount = useMemo(() => {
    let count = 0;
    if (query.filter?.remarkLength) count++;
    if (query.filter?.rate) count++;
    if (query.filter?.view != null) count++;
    return count;
  }, [query.filter]);

  return (
    <Card {...props}>
      <CardContent className="flex flex-col gap-4">
        <RateTypeTabs
          value={(query.filter?.type ?? RateType.Rate) as RateType}
          onChange={(type) =>
            setQuery({ ...query, filter: { ...query.filter, type } })
          }
          rateCount={rateCount}
          markCount={markCount}
        />
        <div className="flex items-center gap-2">
          <RateFilterDrawer
            filter={query.filter ?? {}}
            onChange={(filter) => setQuery({ ...query, filter })}
          >
            <Button variant="outline" size="icon" className="relative md:hidden">
              <FilterIcon size={16} />
              {filterCount > 0 && (
                <Badge className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full px-1 font-mono text-xs tabular-nums">
                  {filterCount}
                </Badge>
              )}
            </Button>
          </RateFilterDrawer>

          <RateFilterSelector
            className="flex-1 max-md:hidden"
            filter={query.filter ?? {}}
            onChange={(filter) => setQuery({ ...query, filter })}
          />
          <RateSortSelect
            value={query.sort}
            onChange={(sort) => setQuery({ ...query, sort })}
          />
          <RateEditDialog modId={scenarioId}>
            <Button className="ml-auto">
              <Plus size={16} />
              {t("rate")}
            </Button>
          </RateEditDialog>
        </div>
        <RateList query={rateQuery} />
      </CardContent>
    </Card>
  );
};
