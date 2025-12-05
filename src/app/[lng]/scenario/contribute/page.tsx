import { getDicechoServerApi } from "@/server/dicecho";
import { getTranslation } from "@/lib/i18n";
import { ScenarioDetailHeader } from "../[id]/header";
import { ScenarioContributePageClient } from "./scenario-contribute-client";

const ScenarioContributePage = async ({
  params,
}: {
  params: Promise<{ lng: string }>;
}) => {
  const { lng } = await params;
  const api = await getDicechoServerApi({ withToken: true });
  const config = await api.module.config();
  const { t } = await getTranslation(lng);

  return (
    <>
      <ScenarioDetailHeader title={t("scenario_upload")} />
      <ScenarioContributePageClient lng={lng} config={config} />
    </>
  );
};

export default ScenarioContributePage;
