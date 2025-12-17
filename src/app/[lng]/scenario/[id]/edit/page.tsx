import { getDicechoServerApi } from "@/server/dicecho";
import { getTranslation } from "@/lib/i18n";
import { ScenarioDetailHeader } from "../header";
import { redirect } from "next/navigation";
import { ScenarioEditPageClient } from "./scenario-edit-client";

const ScenarioEditPage = async ({
  params,
}: {
  params: Promise<{ lng: string; id: string }>;
}) => {
  const { lng, id } = await params;
  const api = await getDicechoServerApi();
  const scenario = await api.module.detail(id);

  const { t } = await getTranslation(lng);

  return (
    <>
      <ScenarioDetailHeader title={t("scenario_edit")} />
      <ScenarioEditPageClient lng={lng} scenario={scenario} />
    </>
  );
};

export default ScenarioEditPage;
