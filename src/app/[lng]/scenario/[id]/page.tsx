import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { getDicechoServerApi } from "@/server/dicecho";
import { RateInfo } from "@/components/Scenario/RateInfo";
import { ScenarioRelatedLink } from "@/components/Scenario/ScenarioRelatedLink";
import { Card } from "@/components/ui/card";
import { Album } from "@/components/Album";
import { Trans } from "react-i18next/TransWithoutContext";
import { StarIcon, HeartIcon, BookmarkPlusIcon, LinkIcon } from "lucide-react";
import { ScenarioDetailHeader } from "./header";
import { ScenarioInfo } from "./ScenarioInfo";
import { ScenarioRateList } from "./rates";

const ScenarioDetailPage = async ({
  params: { lng, id },
}: {
  params: { lng: string; id: string };
  searchParams?: Record<string, string | string[] | undefined>;
}) => {
  const { t } = await useTranslation(lng);
  const api = await getDicechoServerApi();
  const scenario = await api.module.detail(id);
  const actions = (
    <>
      <Button variant="outline" color="primary">
        <StarIcon size={16} />
        {t("rate")}
      </Button>
      <Button variant="outline" color="primary">
        <HeartIcon size={16} />
        {t("mark")}
      </Button>
      <Button variant="outline" color="primary">
        <BookmarkPlusIcon size={16} />
        {t("collect")}
      </Button>
      <Link className="ml-auto" href={scenario.originUrl} target="_blank">
        <Button color="primary">
          <LinkIcon size={16} />
          {t("origin")}
        </Button>
      </Link>
    </>
  );

  return (
    <>
      <ScenarioDetailHeader title={scenario.title} />
      <div className="md:container">
        <div
          className="relative z-0 h-[280px] w-full bg-cover bg-center bg-no-repeat brightness-75 md:hidden"
          style={{ backgroundImage: `url(${scenario.coverUrl})` }}
        />
        <Card className="relative mt-[-16px] rounded-t-2xl p-4 md:mt-10 md:flex md:rounded-lg">
          <div
            className="-mt-[40px] mr-[24px] hidden aspect-[3/4] w-32 bg-cover bg-center shadow-2xl md:block"
            style={{ backgroundImage: `url(${scenario.coverUrl}?width=300&height=400)` }}
          />

          <div className="flex flex-1 flex-col">
            <div className="mb-2 text-2xl font-bold">{scenario.title}</div>
            <div className="mb-2 text-sm">
              <span>[{t("quote_notice")}]</span>
            </div>

            <div className="mt-auto hidden w-full gap-2 md:flex">{actions}</div>
          </div>

          <RateInfo
            className="w-full bg-accent p-4 md:hidden"
            score={scenario.rateAvg}
            count={scenario.rateCount}
            info={scenario.rateInfo}
          />

          <div className="mt-2 flex flex-col gap-2 md:hidden">
            <ScenarioInfo scenario={scenario} lng={lng} />
          </div>

          <div className="ml-4 hidden min-w-40 flex-col gap-2 border-l-[1px] border-solid pl-4 md:flex">
            <div className="capitalize opacity-45">{t("dicecho_rating")}</div>
            {scenario.rateAvg > 0 ? (
              <div>
                <span className="text-4xl font-bold text-primary">
                  {scenario.rateAvg}
                </span>
                <span className="opacity-45"> / 10</span>
              </div>
            ) : (
              <div className="opacity-60">
                {scenario.rateCount === 0
                  ? t("no_rating")
                  : t("too_few_ratings")}
              </div>
            )}
            {scenario.rateCount > 0 && (
              <div className="opacity-60">
                <Trans
                  i18nKey="Rate.ratings"
                  t={t}
                  values={{
                    count: scenario.rateCount,
                  }}
                />
              </div>
            )}
            {scenario.markCount > 0 && (
              <div className="opacity-60">
                <Trans
                  i18nKey="Rate.marks"
                  t={t}
                  values={{
                    count: scenario.markCount,
                  }}
                />
              </div>
            )}
          </div>
        </Card>

        <div className="mt-4 grid grid-cols-6 gap-4">
          <div className="col-span-6 flex flex-col gap-4 md:col-span-4">
            {scenario.imageUrls.length > 0 && (
              <Card className="relative w-full p-4">
                <Album imageUrls={scenario.imageUrls} />
              </Card>
            )}

            {scenario.description && (
              <Card className="relative w-full p-4">
                <article className="line-clamp-4 whitespace-pre-line break-words opacity-65">
                  {scenario.description}
                </article>
              </Card>
            )}

            <RateInfo
              className="w-full bg-card p-4 max-md:hidden"
              score={scenario.rateAvg}
              count={scenario.rateCount}
              info={scenario.rateInfo}
            />

            <ScenarioRateList scenarioId={scenario._id} />
          </div>
          <div className="hidden flex-col gap-4 md:col-span-2 md:flex">
            {scenario.relatedLinks.length > 0 && (
              <ScenarioRelatedLink relatedLinks={scenario.relatedLinks} />
            )}
            <Card className="relative flex w-full flex-col gap-4 p-4">
              <ScenarioInfo scenario={scenario} lng={lng} />
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default ScenarioDetailPage;
