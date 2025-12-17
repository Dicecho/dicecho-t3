import Link from "next/link";
import { getDicechoServerApi } from "@/server/dicecho";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScenarioCardGrid } from "./ScenarioCardGrid";
import { ScenarioCardCarousel } from "./ScenarioCardCarousel";
import { getTranslation } from "@/lib/i18n";
import { ModSortKey } from "@dicecho/types";
import qs from "qs";

interface ScenarioSectionServerProps {
  lng: string;
  type: "hot" | "recent" | "foreign";
  className?: string;
}

export async function ScenarioSectionServer({ lng, type, className }: ScenarioSectionServerProps) {
  const { t } = await getTranslation(lng);
  const api = await getDicechoServerApi();

  let scenarios: Awaited<ReturnType<typeof api.module.list>>["data"] = [];
  let title = "";
  let href = "";

  if (type === "hot") {
    const hotModsData = await api.module.hot({ revalidate: 300 }).catch(() => ({ data: [] }));
    scenarios = hotModsData.data || [];
    title = t("home_hot_scenarios");
    href = `/${lng}/scenario`;
  } else if (type === "recent") {
    const recentModsData = await api.module
      .list({
        pageSize: 8,
        filter: { isForeign: false },
        sort: { [ModSortKey.CREATED_AT]: -1 },
      }, { revalidate: 60 })
      .catch(() => ({ data: [] }));
    scenarios = recentModsData.data || [];
    title = t("home_recent_submissions");
    href = `/${lng}/scenario?filter[isForeign]=false&sort[createdAt]=-1`;
  } else if (type === "foreign") {
    const foreignModsData = await api.module
      .list({
        pageSize: 8,
        filter: { isForeign: true },
        sort: { [ModSortKey.CREATED_AT]: -1 },
      }, { revalidate: 60 })
      .catch(() => ({ data: [] }));
    scenarios = foreignModsData.data || [];
    title = t("home_new_entries");
    href = `/${lng}/scenario?filter[isForeign]=true&sort[createdAt]=-1`;
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <Link href={href}>
          <Button variant="link" size="sm">
            {t("home_view_more")}
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <ScenarioCardGrid scenarios={scenarios} lng={lng} />
      </CardContent>
    </Card>
  );
}

export async function MobileScenarioSectionServer({ lng, type }: Omit<ScenarioSectionServerProps, "className">) {
  const { t } = await getTranslation(lng);
  const api = await getDicechoServerApi();

  let scenarios: Awaited<ReturnType<typeof api.module.list>>["data"] = [];
  let title = "";
  let href = "";

  if (type === "hot") {
    const hotModsData = await api.module.hot({ revalidate: 300 }).catch(() => ({ data: [] }));
    scenarios = hotModsData.data || [];
    title = t("home_hot_scenarios");
    href = `/${lng}/scenario`;
  } else if (type === "recent") {
    const recentModsData = await api.module
      .list({
        pageSize: 8,
        filter: { isForeign: false },
        sort: { [ModSortKey.CREATED_AT]: -1 },
      }, { revalidate: 60 })
      .catch(() => ({ data: [] }));
    scenarios = recentModsData.data || [];
    title = t("home_recent_submissions");
    href = `/${lng}/scenario?${qs.stringify({ filter: { isForeign: false }, sort: { createdAt: -1 } })}`;
  } else if (type === "foreign") {
    const foreignModsData = await api.module
      .list({
        pageSize: 8,
        filter: { isForeign: true },
        sort: { [ModSortKey.CREATED_AT]: -1 },
      }, { revalidate: 60 })
      .catch(() => ({ data: [] }));
    scenarios = foreignModsData.data || [];
    title = t("home_new_entries");
    href = `/${lng}/scenario?${qs.stringify({ filter: { isForeign: true }, sort: { createdAt: -1 } })}`;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3 px-4">
        <h2>{title}</h2>
        <Link href={href}>
          <Button variant="link" size="sm" className="px-0">
            {t("home_view_more")}
          </Button>
        </Link>
      </div>
      <ScenarioCardCarousel scenarios={scenarios} lng={lng} />
    </div>
  );
}
