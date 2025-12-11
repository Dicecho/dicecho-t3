"use client";

import type { ModFilterConfig } from "@dicecho/types";
import { queryToFormData, formDataToQuery } from "@/components/Scenario/utils";
import {
  ScenarioFilter,
  type FilterValue,
} from "@/components/Scenario/ScenarioFilter";
import qs from "qs";
import { usePathname, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useDicecho } from "@/hooks/useDicecho";
import { useScenarioFilterParams } from "@/components/Scenario/use-scenario-filter-params";

interface ScenarioFilterWrapperProps {
  initialConfig?: ModFilterConfig;
}

export function ScenarioSearchParamsFilter({
  initialConfig,
}: ScenarioFilterWrapperProps) {
  const pathname = usePathname();
  const router = useRouter();
  const filterQuery = useScenarioFilterParams();
  const { api } = useDicecho();

  const { data: config } = useQuery({
    queryKey: ["scenario", "config"],
    queryFn: () => api.module.config(),
    initialData: initialConfig,
  });

  const handleFilterChange = (filterValue: FilterValue) => {
    const newQuery = {
      ...filterQuery,
      ...formDataToQuery(filterValue),
    };

    router.push(`${pathname}?${qs.stringify(newQuery)}`);
  };

  return (
    <ScenarioFilter
      config={config}
      value={queryToFormData(filterQuery)}
      onChange={handleFilterChange}
    />
  );
}
