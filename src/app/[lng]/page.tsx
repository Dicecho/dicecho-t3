import { Suspense } from "react";
import { getServerAuthSession } from "@/server/auth";
import { MobileFooter } from "@/components/Footer";
import { MobileHeader } from "@/components/Header/MobileHeader";
import { HeaderMenu } from "@/components/Header/HeaderMenu";
import { HeaderSearch } from "@/components/Header/HeaderSearch";
import { getTranslation } from "@/lib/i18n";
import { BannerServer, BannerSkeleton } from "@/components/Home/BannerServer";
import { CollectionsServer, MobileCollectionsServer } from "@/components/Home/CollectionsServer";
import { ScenarioSectionServer, MobileScenarioSectionServer } from "@/components/Home/ScenarioSectionServer";
import { HomepageProfile } from "@/components/Home/HomepageProfile";
import { HomepageActions } from "@/components/Home/HomepageActions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NotificationReminder } from "@/components/Header/notification-reminder";
import { CollectionGridSkeleton } from "@/components/Home/CollectionGridSkeleton";
import { ScenarioSectionSkeleton } from "@/components/Home/ScenarioSectionSkeleton";
import { MobileScenarioCarouselSkeleton } from "@/components/Home/MobileScenarioCarouselSkeleton";
import { MobileCollectionCarouselSkeleton } from "@/components/Home/MobileCollectionCarouselSkeleton";

// ISR with 60 seconds revalidation
export const revalidate = 60;

export default async function Home(props: {
  params: Promise<{ lng: string }>;
}) {
  const params = await props.params;
  const { lng } = params;

  const { t } = await getTranslation(lng);
  const session = await getServerAuthSession();

  return (
    <>
      <MobileHeader left={<HeaderMenu />} right={<NotificationReminder />}>
        <HeaderSearch />
      </MobileHeader>

      <main className="container md:pt-6 pb-24">
        {/* Desktop Layout */}
        <div className="hidden md:grid md:grid-cols-12 md:gap-6">
          {/* Main Content - Left Side (2/3) */}
          <div className="md:col-span-8">
            {/* Banner */}
            <Suspense fallback={<BannerSkeleton className="mb-6" />}>
              <BannerServer className="mb-6 rounded-lg overflow-hidden" />
            </Suspense>

            {/* Recommended Collections */}
            <Suspense fallback={<CollectionGridSkeleton />}>
              <CollectionsServer lng={lng} />
            </Suspense>

            {/* Recent Submissions */}
            <Suspense fallback={<ScenarioSectionSkeleton className="mb-6" />}>
              <ScenarioSectionServer lng={lng} type="recent" className="mb-6" />
            </Suspense>

            {/* Hot Scenarios */}
            <Suspense fallback={<ScenarioSectionSkeleton className="mb-6" />}>
              <ScenarioSectionServer lng={lng} type="hot" className="mb-6" />
            </Suspense>

            {/* Foreign Mods */}
            <Suspense fallback={<ScenarioSectionSkeleton />}>
              <ScenarioSectionServer lng={lng} type="foreign" />
            </Suspense>
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
        <div className="md:hidden space-y-4 -mx-4">
          {/* Banner */}
          <Suspense fallback={<BannerSkeleton />}>
            <BannerServer />
          </Suspense>

          {/* Recommended Collections */}
          <Suspense fallback={<MobileCollectionCarouselSkeleton />}>
            <MobileCollectionsServer lng={lng} />
          </Suspense>

          {/* Recent Submissions */}
          <Suspense fallback={<MobileScenarioCarouselSkeleton />}>
            <MobileScenarioSectionServer lng={lng} type="recent" />
          </Suspense>

          {/* Hot Scenarios */}
          <Suspense fallback={<MobileScenarioCarouselSkeleton />}>
            <MobileScenarioSectionServer lng={lng} type="hot" />
          </Suspense>

          {/* Foreign Mods */}
          <Suspense fallback={<MobileScenarioCarouselSkeleton />}>
            <MobileScenarioSectionServer lng={lng} type="foreign" />
          </Suspense>
        </div>
      </main>

      <MobileFooter />
    </>
  );
}
