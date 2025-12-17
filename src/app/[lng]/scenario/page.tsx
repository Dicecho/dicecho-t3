import { MobileFooter } from "@/components/Footer";
import { MobileHeader } from "@/components/Header/MobileHeader";
import { HeaderMenu } from "@/components/Header/HeaderMenu";
import { ScenarioListServer } from "@/components/Scenario/scenario-list-server";
import { ScenarioListSkeleton } from "@/components/Scenario/scenario-list-skeleton";
import { Suspense } from "react";
import { HeaderSearch } from "@/components/Header/HeaderSearch";
import { getTranslation } from "@/lib/i18n";
import {
  scenarioSearchParamsCache,
  paramsToQuery,
  serializeScenarioParams,
} from "@/components/Scenario/scenario-search-params";
import { Upload, Plus } from "lucide-react";
import { ScenarioSearchInput } from "@/components/Scenario/search-input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScenarioSearchParamsFilter } from "@/components/Scenario/search-params-filter";
import { RandomButton } from "@/components/Scenario/random-button";
import Link from "next/link";
import { NotificationReminder } from "@/components/Header/notification-reminder";
import { Metadata } from "next";

export const dynamic = "auto";
export const dynamicParams = true;


export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const { locale } = await params;

  const basePath = `/${locale}/scenario`;

  return {
    alternates: {
      canonical: basePath,
      languages: {
        en: "/en/scenario",
        ja: "/ja/scenario",
        zh: "/zh/scenario",
        ko: "/ko/scenario",
      },
    },
  };
}

const ScenarioPage = async ({
  searchParams,
  params,
}: {
  params: Promise<{ lng: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const { lng } = await params;
  const resolvedSearchParams = await searchParams;
  const parsedParams = scenarioSearchParamsCache.parse(resolvedSearchParams);
  const query = paramsToQuery(parsedParams);
  const queryKey = serializeScenarioParams(parsedParams);
  const { t } = await getTranslation(lng);

  return (
    <>
      <MobileHeader left={<HeaderMenu />} right={<NotificationReminder />}>
        <HeaderSearch />
      </MobileHeader>

      <div className="container md:pt-4 pb-24">
        <div className="grid grid-cols-6 gap-8">
          <div className="col-span-6 md:col-span-4">
            <ScenarioSearchInput className="max-md:hidden" />

            <Suspense
              key={queryKey}
              fallback={<ScenarioListSkeleton count={query.pageSize ?? 12} />}
            >
              <ScenarioListServer query={query} />
            </Suspense>
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
                {t("contribute_community_scenario")}
              </Button>
            </Link>

            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle className="capitalize">{t("filter")}</CardTitle>
              </CardHeader>

              <CardContent>
                <ScenarioSearchParamsFilter />
                <RandomButton
                  className="mt-4 w-full capitalize"
                  variant="outline"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <MobileFooter />
    </>
  );
};

export default ScenarioPage;
