import { Card } from "@/components/ui/card";
import { Album } from "@/components/Album";
import { RateInfo } from "@/components/Scenario/RateInfo";
import { ScenarioRelatedLink } from "@/components/Scenario/ScenarioRelatedLink";
import { ScenarioRecommendList } from "@/components/Scenario/ScenarioRecommendList";
import { ScenarioRecommendCarousel } from "@/components/Scenario/scenario-recommend-carousel";
import { AuthorWorks } from "@/components/Scenario/author-works";
import { RelatedCollections } from "@/components/Scenario/related-collections";
import { ScenarioActions } from "@/components/Scenario/scenario-actions";
import { ScenarioInfo } from "./scenario-info";
import { ScenarioHeader } from "./scenario-header";
import { ScenarioRateList } from "./rates";
import { ScenarioDescription } from "@/components/Scenario/ScenarioDescription";

import type { IModDto } from "@dicecho/types";
import { getTranslation } from "@/lib/i18n";

type ScenarioDetailProps = {
  lng: string;
  scenario: IModDto;
};

export async function ScenarioDetail({ lng, scenario }: ScenarioDetailProps) {
  const { t } = await getTranslation(lng);

  return (
    <div className="md:container">
      <ScenarioHeader lng={lng} scenario={scenario} />

      <div className="mt-4 grid grid-cols-6 gap-4">
        <div className="col-span-6 flex flex-col gap-4 md:col-span-4">
          {scenario.imageUrls.length > 0 && (
            <Card className="relative w-full p-4 max-md:rounded-none max-md:px-0 max-md:bg-transparent max-md:shadow-none">
              <Album imageUrls={scenario.imageUrls} />
            </Card>
          )}

          {scenario.description && (
            <Card className="relative w-full p-4 max-md:rounded-none">
              <ScenarioDescription text={scenario.description} />
            </Card>
          )}

          <div className="md:hidden">
            <Card className="relative w-full p-0 py-4 max-md:rounded-none">
              <div className="px-4 text-base font-semibold">
                {t("scenario_similar_modules")}
              </div>
              <ScenarioRecommendCarousel scenarioId={scenario._id} />
            </Card>
          </div>

          <RateInfo
            className="bg-card w-full p-4 max-md:rounded-none"
            score={scenario.rateAvg}
            count={scenario.rateCount}
            info={scenario.rateInfo}
          />

          <ScenarioRateList
            className="max-md:rounded-none"
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
            <ScenarioActions scenario={scenario} />
          </Card>
          <ScenarioRecommendList scenarioId={scenario._id} />
          <AuthorWorks scenarioId={scenario._id} />
          <RelatedCollections scenarioId={scenario._id} />
        </div>
      </div>
    </div>
  );
}
