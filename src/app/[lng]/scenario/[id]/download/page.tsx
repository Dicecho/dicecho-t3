import { getDicechoServerApi } from "@/server/dicecho";
import { getTranslation } from "@/lib/i18n";
import { ScenarioDetailHeader } from "../header";
import { ScenarioHeader } from "../scenario-header";
import { notFound } from "next/navigation";
import { ScenarioDownload } from "@/components/Scenario/scenario-download";

const ScenarioDownloadPage = async ({
  params,
}: {
  params: Promise<{ lng: string; id: string }>;
}) => {
  const { lng, id } = await params;
  const api = await getDicechoServerApi();
  const scenario = await api.module.detail(id, { revalidate: 300 }).catch(() => null);

  if (!scenario) {
    return notFound();
  }

  if (!scenario.modFiles || scenario.modFiles.length === 0) {
    return notFound();
  }

  const { t } = await getTranslation(lng);

  return (
    <>
      <ScenarioDetailHeader title={t("download")} />
      <div className="md:container">
        <ScenarioHeader lng={lng} scenario={scenario} currentTab="download" />

        <div className="mt-4">
          <ScenarioDownload scenario={scenario} />
        </div>
      </div>
    </>
  );
};

export default ScenarioDownloadPage;
