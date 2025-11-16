"use client";
import { RateSortKey, RateType } from "@dicecho/types";
import { RateList } from "@/components/Rate/RateList";
import { RateFilter } from "@/components/Rate/RateFilter";
import { useLocalStorage } from "@/hooks/useLocalStorage";

import type { IRateListQuery } from "@dicecho/types";

const DEFAULT_QUERY: Partial<IRateListQuery> = {
  filter: { type: RateType.Rate },
  sort: { [RateSortKey.RATE_AT]: -1 },
};

export const ScenarioRateList = ({ scenarioId, rateCount = 0, markCount = 0 }: { scenarioId: string, rateCount?: number, markCount?: number }) => {
  const [query, setQuery] = useLocalStorage<
    Pick<Partial<IRateListQuery>, "filter" | "sort">
  >("@rateListQuery", DEFAULT_QUERY);

  const rateQuery: Partial<IRateListQuery> = {
    ...query,
    modId: scenarioId,
  };


  return (
    <>
      <RateFilter rateCount={rateCount} markCount={markCount} query={query} onChange={(query) => setQuery(query)} />
      <RateList query={rateQuery} />
    </>
  );
};
