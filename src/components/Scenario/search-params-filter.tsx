"use client";

import type { ModFilterConfig } from "@dicecho/types";
import { ScenarioFilter } from "@/components/Scenario/ScenarioFilter";
import { useQuery } from "@tanstack/react-query";
import { useDicecho } from "@/hooks/useDicecho";
import {
  useScenarioSearchParams,
  paramsToFilterValue,
  filterValueToParams,
  type FilterValue,
} from "@/components/Scenario/use-scenario-search-params";

interface ScenarioFilterWrapperProps {
  initialConfig?: ModFilterConfig;
}

export function ScenarioSearchParamsFilter({
  initialConfig,
}: ScenarioFilterWrapperProps) {
  const [params, setParams] = useScenarioSearchParams();
  const { api } = useDicecho();

  const { data: config } = useQuery({
    queryKey: ["scenario", "config"],
    queryFn: () => api.module.config(),
    initialData: initialConfig,
  });

  const handleFilterChange = (filterValue: FilterValue) => {
    setParams(filterValueToParams(filterValue));
  };

  return (
    <ScenarioFilter
      config={config}
      value={paramsToFilterValue(params)}
      onChange={handleFilterChange}
    />
  );
}
