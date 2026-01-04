"use client";
import { RateSortKey, RateType } from "@dicecho/types";
import { RateList } from "@/components/Rate/RateList";
import { RateFilter } from "@/components/Rate/RateFilter";
import { useLocalStorage } from "@/hooks/useLocalStorage";

import type { IRateListQuery } from "@dicecho/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTranslation } from "@/lib/i18n/react";
import { RateEditDialog } from "@/components/Rate";

const DEFAULT_QUERY: Partial<IRateListQuery> = {
  filter: { type: RateType.Rate },
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

  return (
    <Card {...props}>
      <CardHeader className="overflow-x-hidden">
        <div className="flex items-center gap-2 flex-wrap">
          <RateFilter
            rateCount={rateCount}
            markCount={markCount}
            query={query}
            onChange={(query) => setQuery(query)}
          />
          <RateEditDialog modId={scenarioId}>
            <Button variant="outline" className="ml-auto">
              <Plus size={16} />
              {t("rate")}
            </Button>
          </RateEditDialog>
        </div>
      </CardHeader>
      <CardContent>
        <RateList query={rateQuery} />
      </CardContent>
    </Card>
  );
};
