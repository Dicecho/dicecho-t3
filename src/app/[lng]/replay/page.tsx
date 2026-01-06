import { Suspense } from "react";
import { MobileFooter } from "@/components/Footer";
import { MobileHeader } from "@/components/Header/MobileHeader";
import { HeaderMenu } from "@/components/Header/HeaderMenu";
import { NotificationReminder } from "@/components/Header/notification-reminder";
import { getDicechoServerApi } from "@/server/dicecho";
import { getServerAuthSession } from "@/server/auth";
import { getTranslation } from "@/lib/i18n";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ReplayBanner } from "@/components/Replay/replay-banner";
import { ReplayList } from "@/components/Replay/replay-list";
import { ReplayListSection } from "@/components/Replay/replay-list-section";
import { ReplayItemSkeleton } from "@/components/Replay/replay-item-skeleton";
import { ReplayUploadDialog } from "@/components/Replay/replay-upload-dialog";
import { HomepageProfile } from "@/components/Home/HomepageProfile";
import { Plus } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "auto";
export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lng: string }>;
}): Promise<Metadata> {
  const { lng } = await params;

  return {
    title: "Replay - Dicecho",
    description: "TRPG replay videos",
    alternates: {
      canonical: `/${lng}/replay`,
      languages: {
        en: "/en/replay",
        zh: "/zh/replay",
        ja: "/ja/replay",
        ko: "/ko/replay",
      },
    },
  };
}

function BannerSkeleton({ className }: { className?: string }) {
  return <Skeleton className={`aspect-[21/9] w-full rounded-lg ${className ?? ""}`} />;
}

export default async function ReplayPage({
  params,
}: {
  params: Promise<{ lng: string }>;
}) {
  const { lng } = await params;
  const { t } = await getTranslation(lng);
  const api = await getDicechoServerApi();
  const session = await getServerAuthSession();

  const [recommendData, listData] = await Promise.all([
    api.replay.list({ filter: { isRecommend: true }, pageSize: 8 }).catch(() => null),
    api.replay.list({ pageSize: 12, sort: { createdAt: -1 } }).catch(() => null),
  ]);

  return (
    <>
      <MobileHeader left={<HeaderMenu />} right={<NotificationReminder />}>
        <span className="text-lg font-semibold text-center">{t("replay")}</span>
      </MobileHeader>

      <main className="container pb-24 md:pt-6">
        {/* Desktop Layout - 12 Grid */}
        <div className="hidden md:grid md:grid-cols-12 md:gap-6">
          {/* Main Content - Left Side (8 cols) */}
          <div className="md:col-span-8">
            {/* Banner Carousel */}
            {recommendData && recommendData.data.length > 0 && (
              <Suspense fallback={<BannerSkeleton className="mb-6" />}>
                <ReplayBanner
                  replays={recommendData.data}
                  className="mb-6 overflow-hidden rounded-lg"
                />
              </Suspense>
            )}

            {/* Video List with Sort */}
            <ReplayListSection
              initialData={listData ?? undefined}
              className="grid-cols-2 md:grid-cols-3"
            />
          </div>

          {/* Sidebar - Right Side (4 cols) */}
          <div className="md:col-span-4">
            <Card className="sticky top-20">
              <CardContent className="pt-6">
                {session?.user && (
                  <>
                    <HomepageProfile user={session.user} lng={lng} />
                    <div className="my-6 border-t" />
                  </>
                )}
                <ReplayUploadDialog>
                  <Button className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    {t("share_new_replay")}
                  </Button>
                </ReplayUploadDialog>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden space-y-4 -mx-4">
          {/* Banner Carousel */}
          {recommendData && recommendData.data.length > 0 && (
            <Suspense fallback={<BannerSkeleton />}>
              <ReplayBanner replays={recommendData.data} />
            </Suspense>
          )}

          {/* Video List */}
          <section className="px-4">
            <h2 className="mb-4 text-lg font-semibold">{t("replay_all")}</h2>
            <Suspense
              fallback={
                <div className="grid grid-cols-2 gap-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <ReplayItemSkeleton key={i} />
                  ))}
                </div>
              }
            >
              {listData ? (
                <ReplayList initialData={listData} className="grid-cols-2" />
              ) : (
                <div className="text-muted-foreground py-8 text-center">
                  {t("no_data")}
                </div>
              )}
            </Suspense>
          </section>
        </div>
      </main>

      <MobileFooter />
    </>
  );
}
