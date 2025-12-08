import Link from "next/link";
import { getServerAuthSession } from "@/server/auth";
import { getDicechoServerApi } from "@/server/dicecho";
import { MobileFooter } from "@/components/Footer";
import { MobileHeader } from "@/components/Header/MobileHeader";
import { HeaderMenu } from "@/components/Header/HeaderMenu";
import { getTranslation } from "@/lib/i18n";
import { BannerCarousel } from "@/components/Home/BannerCarousel";
import { ScenarioCardGrid } from "@/components/Home/ScenarioCardGrid";
import { CollectionCard } from "@/components/Home/CollectionCard";
import { HomepageProfile } from "@/components/Home/HomepageProfile";
import { HomepageActions } from "@/components/Home/HomepageActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ModSortKey } from "@dicecho/types";
import type { BannerDto } from "@/utils/api";

const DEFAULT_BANNER: BannerDto = {
  priority: 0,
  action: "",
  imageUrl: "https://file.dicecho.com/mod/600af94a44f096001d6e49df/2021033103382254.png",
  link: "",
};

export default async function Home(props: {
  params: Promise<{ lng: string }>;
}) {
  const params = await props.params;
  const { lng } = params;

  const { t } = await getTranslation(lng);
  const session = await getServerAuthSession();
  const api = await getDicechoServerApi({ withToken: true });

  // Fetch all home page data in parallel
  const [bannersData, hotModsData, recentModsData, foreignModsData, collectionsData] = 
    await Promise.all([
      api.config.banner().catch(() => [DEFAULT_BANNER]),
      api.module.hot().catch(() => ({ data: [] })),
      api.module
        .list({
          pageSize: 8,
          filter: { isForeign: false },
          sort: { [ModSortKey.CREATED_AT]: -1 },
        })
        .catch(() => ({ data: [] })),
      api.module
        .list({
          pageSize: 8,
          filter: { isForeign: true },
          sort: { [ModSortKey.CREATED_AT]: -1 },
        })
        .catch(() => ({ data: [] })),
      api.collection
        .list({
          pageSize: 6,
          filter: { isRecommend: true },
          sort: { createdAt: -1 },
        })
        .catch(() => ({ data: [] })),
    ]);

  const banners = bannersData.length > 0 ? bannersData : [DEFAULT_BANNER];
  const hotMods = hotModsData.data || [];
  const recentMods = recentModsData.data || [];
  const foreignMods = foreignModsData.data || [];
  const collections = collectionsData.data || [];

  return (
    <>
      <MobileHeader>
        <HeaderMenu />
      </MobileHeader>

      <main className="container mx-auto py-6">
        {/* Desktop Layout */}
        <div className="hidden md:grid md:grid-cols-12 md:gap-6">
          {/* Main Content - Left Side (2/3) */}
          <div className="md:col-span-8">
            {/* Banner */}
            <BannerCarousel banners={banners} className="mb-6" />

            {/* Recommended Collections */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{t("home_recommended_collections")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-10">
                  {collections.map((collection) => (
                    <CollectionCard
                      key={collection._id}
                      collection={collection}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Submissions */}
            <Card className="mb-6">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{t("home_recent_submissions")}</CardTitle>
                <Link href={`/${lng}/scenario?filter[isForeign]=false&sort[createdAt]=-1`}>
                  <Button variant="link" size="sm">
                    {t("home_view_more")}
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <ScenarioCardGrid scenarios={recentMods} lng={lng} />
              </CardContent>
            </Card>

            {/* Hot Scenarios */}
            <Card className="mb-6">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{t("home_hot_scenarios")}</CardTitle>
                <Link href={`/${lng}/scenario`}>
                  <Button variant="link" size="sm">
                    {t("home_view_more")}
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <ScenarioCardGrid scenarios={hotMods} lng={lng} />
              </CardContent>
            </Card>

            {/* Foreign Mods */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{t("home_new_entries")}</CardTitle>
                <Link href={`/${lng}/scenario?filter[isForeign]=true&sort[createdAt]=-1`}>
                  <Button variant="link" size="sm">
                    {t("home_view_more")}
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <ScenarioCardGrid scenarios={foreignMods} lng={lng} />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Right Side (1/3) */}
          <div className="md:col-span-4">
            {session?.user && (
              <Card className="mb-4">
                <CardContent className="pt-6">
                  <HomepageProfile user={session.user} lng={lng} />
                  <div className="mt-6">
                    <HomepageActions lng={lng} />
                  </div>
                </CardContent>
              </Card>
            )}

            <Button
              asChild
              className="w-full mb-4"
            >
              <a href="https://discord.gg/geEpSKFUzG" target="_blank" rel="noopener noreferrer">
                {t("home_discord_join")}
              </a>
            </Button>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden space-y-4">
          {/* Banner */}
          <BannerCarousel banners={banners} />

          {/* Recommended Collections */}
          <div>
            <h2 className="text-xl font-semibold mb-3">{t("home_recommended_collections")}</h2>
            <div className="grid grid-cols-2 gap-3">
              {collections.slice(0, 4).map((collection) => (
                <CollectionCard
                  key={collection._id}
                  collection={collection}
                />
              ))}
            </div>
          </div>

          {/* Recent Submissions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold">{t("home_recent_submissions")}</h2>
              <Link href={`/${lng}/scenario?filter[isForeign]=false&sort[createdAt]=-1`}>
                <Button variant="link" size="sm" className="px-0">
                  {t("home_view_more")}
                </Button>
              </Link>
            </div>
            <ScenarioCardGrid scenarios={recentMods.slice(0, 6)} lng={lng} />
          </div>

          {/* Hot Scenarios */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold">{t("home_hot_scenarios")}</h2>
              <Link href={`/${lng}/scenario`}>
                <Button variant="link" size="sm" className="px-0">
                  {t("home_view_more")}
                </Button>
              </Link>
            </div>
            <ScenarioCardGrid scenarios={hotMods.slice(0, 6)} lng={lng} />
          </div>

          {/* Foreign Mods */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold">{t("home_new_entries")}</h2>
              <Link href={`/${lng}/scenario?filter[isForeign]=true&sort[createdAt]=-1`}>
                <Button variant="link" size="sm" className="px-0">
                  {t("home_view_more")}
                </Button>
              </Link>
            </div>
            <ScenarioCardGrid scenarios={foreignMods.slice(0, 6)} lng={lng} />
          </div>
        </div>
      </main>

      <MobileFooter />
    </>
  );
}
