import type { IModListQuery } from "@dicecho/types";
import { getDicechoServerApi } from "@/server/dicecho";
import { ScenarioList } from "@/components/Scenario/ScenarioList";

interface ScenarioListServerProps {
  query: Partial<IModListQuery>;
}

export async function ScenarioListServer({ query }: ScenarioListServerProps) {
  const api = await getDicechoServerApi();

  // Server-side data fetching with 60s revalidation cache
  // This enables SSR + Streaming with on-demand ISR
  const initialData = await api.module.list(query, { revalidate: 60 });

  return <ScenarioList initialData={initialData} query={query} />;
}
