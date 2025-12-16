import { getTranslation } from "@/lib/i18n";
import { ScenarioDetailHeader } from "../[id]/header";
import { ScenarioPublishPageClient } from "./scenario-publish-client";

const ScenarioPublishPage = async ({
  params,
}: {
  params: Promise<{ lng: string }>;
}) => {
  const { lng } = await params;
  const { t } = await getTranslation(lng);

  return (
    <>
      <ScenarioDetailHeader title={t("publish_scenario")} />
      <ScenarioPublishPageClient lng={lng} />
    </>
  );
};

export default ScenarioPublishPage;
