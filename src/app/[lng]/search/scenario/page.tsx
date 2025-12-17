import { ScenarioListServer } from "@/components/Scenario/scenario-list-server";
import { ScenarioListSkeleton } from "@/components/Scenario/scenario-list-skeleton";
import { ScenarioSearchParamsFilter } from "@/components/Scenario/search-params-filter";
import { getTranslation } from "@/lib/i18n";
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  scenarioSearchParamsCache,
  paramsToQuery,
  serializeScenarioParams,
} from "@/components/Scenario/scenario-search-params";

export const dynamic = "auto";
export const dynamicParams = true;

const ScenarioSearchPage = async (props: {
  params: Promise<{ lng: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) => {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { t } = await getTranslation(params.lng);

  const parsedParams = scenarioSearchParamsCache.parse(searchParams ?? {});
  const query = paramsToQuery(parsedParams);
  const queryKey = serializeScenarioParams(parsedParams);

  return (
    <div className="grid grid-cols-6 gap-8">
      <div className="col-span-6 md:col-span-4">
        <Suspense
          key={queryKey}
          fallback={<ScenarioListSkeleton count={query.pageSize ?? 12} />}
        >
          <ScenarioListServer query={query} />
        </Suspense>
      </div>
      <div className="hidden flex-col gap-4 md:col-span-2 md:flex">
        <Card className="sticky top-20">
          <CardHeader>
            <CardTitle className="capitalize">{t("filter")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ScenarioSearchParamsFilter />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ScenarioSearchPage;
