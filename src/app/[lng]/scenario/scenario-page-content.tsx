"use client";

import type {
  IModListQuery,
  ModFilterConfig,
} from "@dicecho/types";
import { Upload, Plus, Search } from "lucide-react";
import { queryToFormData, formDataToQuery } from "@/components/Scenario/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ScenarioFilter,
  type FilterValue,
} from "@/components/Scenario/ScenarioFilter";
import qs from "qs";
import { ButtonGroup } from "@/components/ui/button-group";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n/react";
import { useDicecho } from "@/hooks/useDicecho";
import { PropsWithChildren, useState } from "react";
import { LinkWithLng } from "@/components/Link";

const DEFAULT_QUERY: Partial<IModListQuery> = {
  sort: { lastRateAt: -1 },
  pageSize: 12,
};

function queryToUrl(query: Partial<IModListQuery>): string {
  return qs.stringify(query);
}

interface ScenarioPageContentProps {
  config: ModFilterConfig;
  query: Partial<IModListQuery>;
}

export function ScenarioPageContent({
  config,
  query,
  children,
}: PropsWithChildren<ScenarioPageContentProps>) {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { api } = useDicecho();

  const [searchKeyword, setSearchKeyword] = useState(query.keyword || "");

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const keyword = searchKeyword.trim();
    if (keyword) {
      const newQuery: Partial<IModListQuery> = {
        ...DEFAULT_QUERY,
        ...query,
        keyword,
      };
      router.push(`/${i18n.language}/scenario?${queryToUrl(newQuery)}`);
    }
  };

  const handleRandom = async () => {
    const scenario = await api.module.random(query);
    router.push(`/${i18n.language}/scenario/${scenario._id}`);
  };

  const handleFilterChange = (filterValue: FilterValue) => {
    router.push(
      `/${i18n.language}/scenario?${queryToUrl({
        ...DEFAULT_QUERY,
        ...query,      // Preserve existing query params (like keyword)
        ...formDataToQuery(filterValue),   // Apply filter changes
      })}`,
    );
  };


  return (
    <div className="container pt-4">
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
          {children}
        </div>
        <div className="hidden flex-col gap-4 md:col-span-2 md:flex">
          <LinkWithLng href={`/scenario/publish`}>
            <Button className="w-full capitalize">
              <Upload size={16} />
              {t("scenario_publish")}
            </Button>
          </LinkWithLng>
          <LinkWithLng href={`/scenario/contribute`}>
            <Button className="w-full capitalize">
              <Plus size={16} />
              {t("commit_scenario_page")}
            </Button>
          </LinkWithLng>

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
