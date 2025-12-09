import type { IModListQuery } from "@dicecho/types";
import { ScenarioFilterWrapper } from "./filter-wrapper";
import { ScenarioListServer } from "./scenario-list";
import { ScenarioListSkeleton } from "@/components/Scenario/scenario-list-skeleton";
import { Empty } from "@/components/Empty";
import qs from "qs";
import { getTranslation } from "@/lib/i18n";
import { getDicechoServerApi } from "@/server/dicecho";
import { Suspense } from "react";

const DEFAULT_QUERY: Partial<IModListQuery> = {
  sort: { lastRateAt: -1 },
  pageSize: 12,
};

export const dynamic = "auto";
export const dynamicParams = true;

const ScenarioSearchPage = async (props: {
  params: Promise<{ lng: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) => {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const { lng } = params;

  const parsedParams =
    searchParams && Object.keys(searchParams).length > 0
      ? qs.parse(qs.stringify(searchParams), {
          decoder(value, defaultDecoder) {
            const decoded = defaultDecoder(value);
            if (/^-?\d+$/.test(decoded)) {
              return parseInt(decoded, 10);
            }
            return decoded;
          },
        })
      : {};

  const query: Partial<IModListQuery> = {
    ...DEFAULT_QUERY,
    ...parsedParams,
  };

  const keyword = (searchParams?.keyword as string) || "";

  if (!keyword) {
    const { t } = await getTranslation(lng);
    return <Empty emptyText={t("search_no_keyword")} />;
  }

  const finalQuery = { ...query, keyword };
  const api = await getDicechoServerApi();
  const config = await api.module.config();
  const queryKey = qs.stringify(finalQuery);

  return (
    <ScenarioFilterWrapper lng={lng} config={config} query={finalQuery}>
      <Suspense
        key={queryKey}
        fallback={<ScenarioListSkeleton count={finalQuery.pageSize ?? 12} />}
      >
        <ScenarioListServer query={finalQuery} />
      </Suspense>
    </ScenarioFilterWrapper>
  );
};

export default ScenarioSearchPage;
