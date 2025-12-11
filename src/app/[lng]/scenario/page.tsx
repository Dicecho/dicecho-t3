import type { IModListQuery } from "@dicecho/types";
import { MobileFooter } from "@/components/Footer";
import { MobileHeader } from "@/components/Header/MobileHeader";
import { HeaderMenu } from "@/components/Header/HeaderMenu";
import { ScenarioPageContent } from "./scenario-page-content";
import { ScenarioListServer } from "./scenario-list";
import { ScenarioListSkeleton } from "@/components/Scenario/scenario-list-skeleton";
import { Suspense } from "react";
import qs from "qs";
import { getDicechoServerApi } from "@/server/dicecho";
import { HeaderSearch } from "@/components/Header/HeaderSearch";

const DEFAULT_QUERY: Partial<IModListQuery> = {
  sort: { lastRateAt: -1 },
  pageSize: 12,
};

export const dynamic = "auto";
export const dynamicParams = true;

const ScenarioPage = async ({
  searchParams,
  params,
}: {
  params: Promise<{ lng: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const resolvedSearchParams = await searchParams;

  const parsedParams =
    Object.keys(resolvedSearchParams).length > 0
      ? qs.parse(qs.stringify(resolvedSearchParams), {
          decoder(value, defaultDecoder) {
            // First decode the URL-encoded value
            const decoded = defaultDecoder(value);
            // Then convert numeric strings to numbers
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

  const api = await getDicechoServerApi();
  const config = await api.module.config();
  const queryKey = qs.stringify(query);

  return (
    <>
      <MobileHeader left={<HeaderMenu />}>
        <HeaderSearch />
      </MobileHeader>
      <ScenarioPageContent config={config} query={query}>
        <Suspense
          key={queryKey}
          fallback={<ScenarioListSkeleton count={query.pageSize ?? 12} />}
        >
          <ScenarioListServer query={query} />
        </Suspense>
      </ScenarioPageContent>
      <MobileFooter />
    </>
  );
};

export default ScenarioPage;
