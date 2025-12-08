import type { IModListQuery } from "@dicecho/types";
import { MobileFooter } from "@/components/Footer";
import { MobileHeader } from "@/components/Header/MobileHeader";
import { HeaderMenu } from "@/components/Header/HeaderMenu";
import { ScenarioListWithFilter } from "./ScenarioListWithFilter";
import qs from "qs";
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

const ScenarioPage = async (props: {
  params: Promise<{ lng: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) => {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const { lng } = params;

  const query = searchParams
    ? urlToQuery(qs.stringify(searchParams))
    : DEFAULT_QUERY;

  const api = await getDicechoServerApi();
  

  const config = await api.module.config();

  return (
    <>
      <MobileHeader>
        <HeaderMenu />
      </MobileHeader>
      <ScenarioListWithFilter
        lng={lng}
        // initialScenarios={scenarios}
        initialConfig={config}
        initialQuery={query}
      />
      <MobileFooter />
    </>
  );
};

export default ScenarioPage;
