import Link from "next/link";
import { Trans } from "react-i18next/TransWithoutContext";
import {
  BookmarkPlusIcon,
  HeartIcon,
  LinkIcon,
  PencilIcon,
  StarIcon,
  UserPenIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Album } from "@/components/Album";
import { RateInfo } from "@/components/Scenario/RateInfo";
import { ScenarioRelatedLink } from "@/components/Scenario/ScenarioRelatedLink";
import { ScenarioRecommendList } from "@/components/Scenario/ScenarioRecommendList";
import { ScenarioRecommendCarousel } from "@/components/Scenario/scenario-recommend-carousel";
import { AuthorWorks } from "@/components/Scenario/author-works";
import { RelatedCollections } from "@/components/Scenario/related-collections";
import { ScenarioInfo } from "./ScenarioInfo";
import { ScenarioRateList } from "./rates";
import { ScenarioDescription } from "@/components/Scenario/ScenarioDescription";

import type { IModDto } from "@dicecho/types";
import { LinkWithLng } from "@/components/Link";
import { getTranslation } from "@/lib/i18n";

type ScenarioDetailProps = {
  lng: string;
  scenario: IModDto;
};

export async function ScenarioDetail({ lng, scenario }: ScenarioDetailProps) {
  const { t } = await getTranslation(lng);

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
      {scenario.canEdit ? (
        <Link href={`/${lng}/scenario/${scenario._id}/edit`}>
          <Button variant="outline" color="primary">
            <PencilIcon size={16} />
            {t("scenario_edit")}
          </Button>
        </Link>
      ) : (
        <Link href={`/${lng}/scenario/${scenario._id}/edit`}>
          <Button variant="outline" color="primary">
            <UserPenIcon size={16} />
            {t("scenario_apply_edit")}
          </Button>
        </Link>
      )}
      {scenario.originUrl && (
        <Link className="ml-auto" href={scenario.originUrl} target="_blank">
          <Button color="primary">
            <LinkIcon size={16} />
            {t("origin")}
          </Button>
        </Link>
      )}
    </>
  );

  return (
    <div className="md:container">
      <div
        className="relative z-0 h-[280px] w-full bg-cover bg-center bg-no-repeat brightness-75 md:hidden"
        style={{ backgroundImage: `url(${scenario.coverUrl})` }}
      />
      <Card className="relative mt-[-16px] rounded-t-2xl p-4 md:mt-10 md:flex md:flex-row">
        <div
          className="-mt-[40px] mr-[24px] hidden aspect-3/4 w-32 rounded-md bg-cover bg-center shadow-2xl md:block"
          style={{
            backgroundImage: `url(${scenario.coverUrl}?width=300&height=400)`,
          }}
        />

        <div className="flex flex-1 flex-col">
          <div className="mb-2 text-2xl font-bold">{scenario.title}</div>
          <div className="text-muted-foreground mb-2 text-sm">
            <span>[{t("quote_notice")}]</span>
          </div>

          <div className="mt-auto hidden w-full flex-wrap gap-2 md:flex">
            {actions}
          </div>
        </div>

        <RateInfo
          className="bg-card w-full p-4 md:hidden"
          score={scenario.rateAvg}
          count={scenario.rateCount}
          info={scenario.rateInfo}
        />

        <div className="mt-2 flex flex-col gap-2 md:hidden">
          <ScenarioInfo scenario={scenario} />
          <div className="flex w-full flex-wrap gap-2">{actions}</div>
        </div>

        <div className="ml-4 hidden min-w-40 flex-col gap-2 border-l border-solid pl-4 md:flex">
          <div className="text-muted-foreground capitalize">
            {t("dicecho_rating")}
          </div>
          {scenario.rateAvg > 0 ? (
            <div>
              <span className="text-primary text-4xl font-bold">
                {scenario.rateAvg}
              </span>
              <span className="text-muted-foreground"> / 10</span>
            </div>
          ) : (
            <div className="text-muted-foreground">
              {scenario.rateCount === 0 ? t("no_rating") : t("too_few_ratings")}
            </div>
          )}
          {scenario.rateCount > 0 && (
            <div className="text-muted-foreground">
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
            <div className="text-muted-foreground">
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
              <ScenarioDescription text={scenario.description} />
            </Card>
          )}

          <div className="md:hidden">
            <Card className="relative w-full p-0 py-4">
              <div className="px-4 text-base font-semibold">
                {t("scenario_similar_modules")}
              </div>
              <ScenarioRecommendCarousel scenarioId={scenario._id} />
            </Card>
          </div>

          <RateInfo
            className="bg-card w-full p-4 max-md:hidden"
            score={scenario.rateAvg}
            count={scenario.rateCount}
            info={scenario.rateInfo}
          />

          <ScenarioRateList
            rateCount={scenario.rateCount}
            markCount={scenario.markCount}
            scenarioId={scenario._id}
          />
        </div>
        <div className="hidden flex-col gap-4 md:col-span-2 md:flex">
          {scenario.relatedLinks.length > 0 && (
            <ScenarioRelatedLink relatedLinks={scenario.relatedLinks} />
          )}
          <Card className="relative flex w-full flex-col gap-4 p-4">
            <ScenarioInfo scenario={scenario} />
          </Card>
          <ScenarioRecommendList scenarioId={scenario._id} />
          <AuthorWorks scenarioId={scenario._id} />
          <RelatedCollections scenarioId={scenario._id} />
        </div>
      </div>
    </div>
  );
}
