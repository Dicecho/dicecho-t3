"use client";

import type { IModListQuery, ModListApiResponse, ModFilterConfig } from "@dicecho/types";
import { queryToFormData, formDataToQuery } from "@/components/Scenario/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScenarioList } from "@/components/Scenario/ScenarioList";
import { ScenarioFilter } from "@/components/Scenario/ScenarioFilter";
import { Empty } from "@/components/Empty";
import qs from "qs";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "@/lib/i18n/react";
import { useState, useEffect } from "react";

const DEFAULT_QUERY: Partial<IModListQuery> = {
  sort: { lastRateAt: -1 },
  pageSize: 12,
};

function urlToQuery(searchQuery: string): Partial<IModListQuery> {
  return {
    ...DEFAULT_QUERY,
    ...qs.parse(searchQuery),
  };
}

interface ScenarioSearchContentProps {
  lng: string;
  initialScenarios: ModListApiResponse;
  initialConfig: ModFilterConfig;
  initialQuery: Partial<IModListQuery>;
  keyword: string;
}

export function ScenarioSearchContent({
  lng,
  initialScenarios,
  initialConfig,
  initialQuery,
  keyword: initialKeyword,
}: ScenarioSearchContentProps) {
  const searchParams = useSearchParams();
  const { t } = useTranslation();

  const keyword = searchParams.get("keyword") || initialKeyword;

  // Manage query state locally
  const [query, setQuery] = useState<Partial<IModListQuery>>({
    ...initialQuery,
    keyword,
  });

  // Update query when URL changes (e.g., browser back/forward)
  useEffect(() => {
    const newQuery = searchParams.toString()
      ? urlToQuery(searchParams.toString())
      : DEFAULT_QUERY;
    setQuery({ ...newQuery, keyword });
  }, [searchParams, keyword]);

  // Check if current query matches initial query
  const isInitialQuery = JSON.stringify(query) === JSON.stringify(initialQuery);

  const handleFilterChange = (newQuery: Partial<IModListQuery>) => {
    const fullQuery = { 
      ...DEFAULT_QUERY,
      ...newQuery,
      keyword,
    };
    const newUrl = `/${lng}/search/scenario?${qs.stringify(fullQuery)}`;
    
    // Update URL without triggering navigation
    window.history.replaceState(
      { ...window.history.state, as: newUrl, url: newUrl },
      "",
      newUrl
    );
    
    setQuery(fullQuery);
  };

  if (!keyword) {
    return <Empty emptyText={t("search_no_keyword")} />;
  }

  return (
    <div className="grid grid-cols-6 gap-8">
      <div className="col-span-6 md:col-span-4">
        <ScenarioList initialData={isInitialQuery ? initialScenarios : undefined} query={query} />
      </div>
      <div className="hidden flex-col gap-4 md:col-span-2 md:flex">
        <Card className="sticky top-20">
          <CardHeader>
            <CardTitle className="capitalize">{t("filter")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ScenarioFilter
              config={initialConfig}
              initialFilter={queryToFormData(query)}
              onChange={(data) => handleFilterChange(formDataToQuery(data))}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

