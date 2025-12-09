"use client";

import type { IModListQuery, ModFilterConfig } from "@dicecho/types";
import { queryToFormData, formDataToQuery } from "@/components/Scenario/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScenarioFilter, type FilterValue } from "@/components/Scenario/ScenarioFilter";
import qs from "qs";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n/react";
import { PropsWithChildren } from "react";

const DEFAULT_QUERY: Partial<IModListQuery> = {
  sort: { lastRateAt: -1 },
  pageSize: 12,
};

function queryToUrl(query: Partial<IModListQuery>): string {
  return qs.stringify(query);
}

interface ScenarioFilterWrapperProps {
  lng: string;
  config: ModFilterConfig;
  query: Partial<IModListQuery>;
}

export function ScenarioFilterWrapper({
  lng,
  config,
  query,
  children,
}: PropsWithChildren<ScenarioFilterWrapperProps>) {
  const router = useRouter();
  const { t } = useTranslation();

  const handleFilterChange = (filterValue: FilterValue) => {
    router.push(
      `/${lng}/search/scenario?${queryToUrl({
        ...DEFAULT_QUERY,
        ...query,
        ...formDataToQuery(filterValue),
      })}`,
    );
  };

  return (
    <div className="grid grid-cols-6 gap-8">
      <div className="col-span-6 md:col-span-4">{children}</div>
      <div className="hidden flex-col gap-4 md:col-span-2 md:flex">
        <Card className="sticky top-20">
          <CardHeader>
            <CardTitle className="capitalize">{t("filter")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ScenarioFilter
              config={config}
              value={queryToFormData(query)}
              onChange={handleFilterChange}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

