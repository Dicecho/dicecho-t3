import { getDicechoServerApi } from "@/server/dicecho";
import { ScenarioDetailClient } from "./ScenarioDetailClient";

const ScenarioDetailPage = async ({
  params,
}: {
  params: Promise<{ lng: string; id: string }>;
}) => {
  const resolvedParams = await params;

  const { lng, id } = resolvedParams;

  const api = await getDicechoServerApi();
  const scenario = await api.module.detail(id);

  return (
    <ScenarioDetailClient
      lng={lng}
      scenarioId={id}
      initialScenario={scenario}
    />
  );
};

export default ScenarioDetailPage;
