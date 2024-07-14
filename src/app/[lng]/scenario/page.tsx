import { IModListQuery, ModSortKey } from "@dicecho/types";
import { useState } from "react";
import { Upload, Plus, Search } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import {
  ScenarioFilter,
  FormData as ScenarioFilterData,
} from "@/components/Scenario/ScenarioFilter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScenarioList } from "@/components/Scenario/ScenarioList";
import { omit } from "lodash";
import qs from "qs";
import { getDicechoServerApi } from "@/server/dicecho";

// export const getServerSideProps: GetServerSideProps<PageProps> = async ({
//   query,
//   locale,
// }) => ({
//   props: {
//     initialQuery: urlToQuery(qs.stringify(query)),
//     ...(await serverSideTranslations(locale ?? "en", ["common", "scenario"])),
//   },
// });

const DEFAULT_QUERY: Partial<IModListQuery> = {
  sort: { lastRateAt: -1 },
};

// function queryToFormData(query: Partial<IModListQuery>): ScenarioFilterData {
//   return {
//     rule: query.filter?.moduleRule,
//     language: query.languages?.[0],
//     sortKey: Object.keys(query.sort ?? { lastRateAt: "-1" })[0] as ModSortKey,
//     sortOrder: Object.values(query.sort ?? { lastRateAt: "-1" })[0],
//   };
// }

// function formDataToQuery(data: ScenarioFilterData): Partial<IModListQuery> {
//   const query: Partial<IModListQuery> = {};
//   if (data.rule) {
//     Object.assign(query, {
//       filter: {
//         moduleRule: data.rule,
//       },
//     });
//   }

//   if (data.language) {
//     Object.assign(query, {
//       languages: [data.language],
//     });
//   }

//   if (data.sortKey && data.sortOrder) {
//     Object.assign(query, {
//       sort: {
//         [data.sortKey]: data.sortOrder,
//       },
//     });
//   }

//   return query;
// }

function urlToQuery(searchQuery: string): Partial<IModListQuery> {
  return {
    ...DEFAULT_QUERY,
    ...qs.parse(searchQuery),
  };
}

function queryToUrl(query: Partial<IModListQuery>): string {
  return qs.stringify(query);
}

const ScenarioPage = async ({
  params: { lng },
  searchParams,
}: {
  params: { lng: string };
  searchParams?: Record<string, string | string[] | undefined>;
}) => {
  const query = searchParams
    ? urlToQuery(qs.stringify(searchParams))
    : DEFAULT_QUERY;
  const { t } = await useTranslation(lng);
  const api = await getDicechoServerApi();
  const config = await api.module.config();
  const scenarios = await api.module.list(query);
  // const [query, setQuery] = useState<Partial<IModListQuery>>(initialQuery);
  // const [searchText, setSearchText] = useState("");

  // const handleQueryChange = (newQuery: Partial<IModListQuery>) => {
  //   const query = omit(newQuery, "page");
  //   const newUrlQuery = queryToUrl(query);
  //   router.replace({ query: newUrlQuery });

  //   setQuery(query);
  // };

  const handleSearch = () => {
    console.log("search todo");
    // handleQueryChange({
    //   ...query,
    //   keyword: searchText,
    // });
  };

  const handleRandom = () => {
    console.log("random todo");

    // api.module.random().then((res) => {
    //   router.push(`/scenario/${res._id}`);
    // });
  };

  return (
    <div className="container mx-auto pt-4">
      <div className="grid grid-cols-6 gap-8">
        <div className="col-span-6 md:col-span-4">
          <div className="join flex w-full items-center">
            <Input
              className="join-item"
              placeholder={t("scenario_search_placeholder", { ns: "scenario" })}
              // value={searchText}
              // onChange={(e) => setSearchText(e.currentTarget.value)}
              // onEnter={handleSearch}
            />
            <Button
              className="join-item capitalize"
              color="primary"
              // onClick={handleSearch}
            >
              <Search size={16} />
              {t("search")}
            </Button>
          </div>
          <ScenarioList initialData={scenarios} query={query} />
        </div>
        <div className="hidden flex-col gap-4 md:col-span-2 md:flex">
          <Button className="capitalize" variant="outline" color="primary">
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
                // initialFilter={queryToFormData(query)}
                // onChange={(data) => handleQueryChange(formDataToQuery(data))}
              />
              <Button
                className="mt-4 w-full capitalize"
                // onClick={() => handleRandom()}
                variant="outline"
              >
                {t("random_scenario")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ScenarioPage;
