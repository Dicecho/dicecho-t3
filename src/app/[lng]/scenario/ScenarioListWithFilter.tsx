"use client";

import type {
  IModListQuery,
  ModListApiResponse,
  ModFilterConfig,
} from "@dicecho/types";
import { Upload, Plus, Search } from "lucide-react";
import { queryToFormData, formDataToQuery } from "@/components/Scenario/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScenarioList } from "@/components/Scenario/ScenarioList";
import {
  ScenarioFilter,
  type ScenarioFilterProps,
} from "@/components/Scenario/ScenarioFilter";
import qs from "qs";
import { ButtonGroup } from "@/components/ui/button-group";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n/react";
import { useDicecho } from "@/hooks/useDicecho";
import { useState, useEffect } from "react";
import Link from "next/link";

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

function queryToUrl(query: Partial<IModListQuery>): string {
  return qs.stringify(query);
}

interface ScenarioListWithFilterProps {
  lng: string;
  initialScenarios: ModListApiResponse;
  initialConfig: ScenarioFilterProps["config"];
  initialQuery: Partial<IModListQuery>;
}

export function ScenarioListWithFilter({
  lng,
  initialScenarios,
  initialConfig,
  initialQuery,
}: ScenarioListWithFilterProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useTranslation();
  const { api } = useDicecho();

  console.log("initialScenarios", initialQuery);

  const [searchKeyword, setSearchKeyword] = useState(
    initialQuery.keyword || "",
  );

  // Manage query state locally
  const [query, setQuery] = useState<Partial<IModListQuery>>(initialQuery);

  // Update query when URL changes (e.g., browser back/forward)
  useEffect(() => {
    const newQuery = searchParams.toString()
      ? urlToQuery(searchParams.toString())
      : DEFAULT_QUERY;
    setQuery(newQuery);
    setSearchKeyword(newQuery.keyword || "");
  }, [searchParams]);

  // Check if current query matches initial query
  const isInitialQuery = JSON.stringify(query) === JSON.stringify(initialQuery);

  // Fetch scenarios with client-side query changes
  // const { data: scenarios } = useQuery({
  //   queryKey: ["scenarios", ...Object.values(query)],
  //   queryFn: () => api.module.list(query),
  //   // Only use initialData for the initial query to avoid cache issues
  //   ...(isInitialQuery ? { initialData: initialScenarios } : {}),
  // });

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const keyword = searchKeyword.trim();
    if (keyword) {
      const newQuery: Partial<IModListQuery> = {
        ...DEFAULT_QUERY,
        ...query,
        keyword,
      };
      const newUrl = `/${lng}/scenario?${queryToUrl(newQuery)}`;

      // Update URL without triggering navigation
      window.history.replaceState(
        { ...window.history.state, as: newUrl, url: newUrl },
        "",
        newUrl,
      );

      setQuery(newQuery);
    }
  };

  const handleRandom = async () => {
    const scenario = await api.module.random(query);
    router.push(`/${lng}/scenario/${scenario._id}`);
  };

  const handleFilterChange = (newQuery: Partial<IModListQuery>) => {
    const newUrl = `/${lng}/scenario?${queryToUrl({
      ...DEFAULT_QUERY,
      ...newQuery,
    })}`;

    // Update URL without triggering navigation
    window.history.replaceState(
      { ...window.history.state, as: newUrl, url: newUrl },
      "",
      newUrl,
    );

    setQuery({
      ...DEFAULT_QUERY,
      ...newQuery,
    });
  };

  return (
    <div className="container mx-auto pt-4 max-md:px-4">
      <div className="grid grid-cols-6 gap-8">
        <div className="col-span-6 md:col-span-4">
          <form onSubmit={handleSearch} className="flex w-full items-center">
            <ButtonGroup orientation="horizontal" className="w-full">
              <Input
                placeholder={t("scenario_search_placeholder", {
                  ns: "scenario",
                })}
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
              <Button className="capitalize" color="primary" type="submit">
                <Search size={16} />
                {t("search")}
              </Button>
            </ButtonGroup>
          </form>
          <ScenarioList
            initialData={isInitialQuery ? initialScenarios : undefined}
            query={query}
          />
        </div>
        <div className="hidden flex-col gap-4 md:col-span-2 md:flex">
          <Link href={`/${lng}/scenario/publish`}>
            <Button className="w-full capitalize">
              <Upload size={16} />
              {t("scenario_publish")}
            </Button>
          </Link>
          <Link href={`/${lng}/scenario/contribute`}>
            <Button className="w-full capitalize">
              <Plus size={16} />
              {t("commit_scenario_page")}
            </Button>
          </Link>

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
              <Button
                className="mt-4 w-full capitalize"
                variant="outline"
                onClick={handleRandom}
              >
                {t("random_scenario")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
