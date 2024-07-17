"use client";

import type { IModListQuery } from "@dicecho/types";
import {
  ScenarioFilter,
  type ScenarioFilterProps,
} from "@/components/Scenario/ScenarioFilter";
import { formDataToQuery } from "@/components/Scenario/utils";
import qs from "qs";
import { useParams, useRouter } from "next/navigation";

function queryToUrl(query: Partial<IModListQuery>): string {
  return qs.stringify(query);
}

export const Filter = ({
  config,
  initialFilter,
}: {
  config: ScenarioFilterProps["config"];
  initialFilter?: ScenarioFilterProps["initialFilter"];
}) => {
  const router = useRouter();
  const { lng } = useParams<{ lng: string }>();
  const handleQueryChange = (query: Partial<IModListQuery>) => {
    router.replace(`/${lng}/scenario?${queryToUrl(query)}`);
  };

  return (
    <ScenarioFilter
      config={config}
      initialFilter={initialFilter}
      onChange={(data) => handleQueryChange(formDataToQuery(data))}
    />
  );
};
