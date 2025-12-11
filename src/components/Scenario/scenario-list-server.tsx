import type { IModListQuery } from "@dicecho/types";
import { getDicechoServerApi } from "@/server/dicecho";
import { ScenarioList } from "@/components/Scenario/scenario-list";

interface ScenarioListServerProps {
  query: Partial<IModListQuery>;
}

export async function ScenarioListServer({ query }: ScenarioListServerProps) {
  const api = await getDicechoServerApi();
  const initialData = await api.module.list(query, { revalidate: 60 });

  return <ScenarioList initialData={initialData} query={query} />;
}
