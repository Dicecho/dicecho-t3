import { getTranslation } from "@/lib/i18n";
import { ScenarioDetailHeader } from "../[id]/header";
import { ScenarioContributePageClient } from "./scenario-contribute-client";

const ScenarioContributePage = async ({
  params,
}: {
  params: Promise<{ lng: string }>;
}) => {
  const { lng } = await params;
  const { t } = await getTranslation(lng);

  return (
    <>
      <ScenarioDetailHeader title={t("publish_scenario")} />
      <ScenarioContributePageClient lng={lng} />
    </>
  );
};

export default ScenarioContributePage;
