import type { IModListQuery } from "@dicecho/types";
import { ScenarioSearchClient } from "./ScenarioSearchClient";
import { Empty } from "@/components/Empty";
import qs from "qs";
import { getTranslation } from "@/lib/i18n";
import { getDicechoServerApi } from "@/server/dicecho";

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

const ScenarioSearchPage = async (props: {
  params: Promise<{ lng: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) => {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const { lng } = params;

  const query = searchParams
    ? urlToQuery(qs.stringify(searchParams))
    : DEFAULT_QUERY;

  const keyword = (searchParams?.keyword as string) || "";

  if (!keyword) {
    const { t } = await getTranslation(lng);
    return <Empty emptyText={t("search_no_keyword")} />;
  }

  // Add keyword to query
  const finalQuery = { ...query, keyword };

  const api = await getDicechoServerApi();
  
  // Fetch config and initial data in parallel on server
  const [config, scenarios] = await Promise.all([
    api.module.config(),
    api.module.list({ ...finalQuery, pageSize: 20 }),
  ]);

  if (scenarios.totalCount === 0) {
    const { t } = await getTranslation(lng);
    return <Empty emptyText={t("search_no_scenario")} />;
  }

  return (
    <ScenarioSearchClient
      lng={lng}
      initialScenarios={scenarios}
      initialConfig={config}
      initialQuery={finalQuery}
      keyword={keyword}
    />
  );
};

export default ScenarioSearchPage;
