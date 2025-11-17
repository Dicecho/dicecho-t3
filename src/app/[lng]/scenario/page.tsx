import type { IModListQuery } from "@dicecho/types";
import { Upload, Plus, Search } from "lucide-react";
import { getTranslation } from "@/lib/i18n";
import { queryToFormData } from "@/components/Scenario/utils";
import { MobileFooter } from "@/components/Footer";
import { MobileHeader } from "@/components/Header/MobileHeader";
import { HeaderMenu } from "@/components/Header/HeaderMenu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScenarioList } from "@/components/Scenario/ScenarioList";
import { Filter as ScenarioFilter } from "./Filter";
import qs from "qs";
import { getDicechoServerApi } from "@/server/dicecho";
import { redirect } from "next/navigation";
import { ButtonGroup } from "@/components/ui/button-group";

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
  const { t } = await getTranslation(lng);
  const api = await getDicechoServerApi();
  const config = await api.module.config();
  const scenarios = await api.module.list(query);

  const handleSearch = async (data: FormData) => {
    "use server";
    const keyword = data.get("keyword")?.toString();
    if (keyword && keyword !== "") {
      const newQuery: Partial<IModListQuery> = {
        ...query,
        keyword,
      };

      redirect(`/${lng}/scenario?${queryToUrl(newQuery)}`);
    }
  };

  const handleRandom = async () => {
    "use server";
    const api = await getDicechoServerApi();
    const scenario = await api.module.random(query);

    redirect(`/${lng}/scenario/${scenario._id}`);
  };

  return (
    <>
      <MobileHeader>
        <HeaderMenu />
      </MobileHeader>
      <div className="container mx-auto pt-4 max-md:px-4">
        <div className="grid grid-cols-6 gap-8">
          <div className="col-span-6 md:col-span-4">
            <form action={handleSearch} className="flex w-full items-center">
              <ButtonGroup orientation="horizontal" className="w-full">
                <Input
                  placeholder={t("scenario_search_placeholder", {
                    ns: "scenario",
                  })}
                  name="keyword"
                  defaultValue={query.keyword}
                />
                <Button className="capitalize" color="primary" type="submit">
                  <Search size={16} />
                  {t("search")}
                </Button>
              </ButtonGroup>
            </form>
            <ScenarioList initialData={scenarios} query={query} />
          </div>
          <div className="hidden flex-col gap-4 md:col-span-2 md:flex">
            <Button className="capitalize">
              <Upload size={16} />
              {t("scenario_publish")}
            </Button>
            <Button className="capitalize" variant="outline" color="primary">
              <Plus size={16} />
              {t("commit_scenario_page")}
            </Button>

            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle className="capitalize">{t("filter")}</CardTitle>
              </CardHeader>

              <CardContent>
                <ScenarioFilter
                  config={config}
                  initialFilter={queryToFormData(query)}
                />
                <form action={handleRandom}>
                  <Button
                    className="mt-4 w-full capitalize"
                    variant="outline"
                    type="submit"
                  >
                    {t("random_scenario")}
                  </Button>
                </form>
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
