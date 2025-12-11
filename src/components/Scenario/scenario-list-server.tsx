import type { IModListQuery } from "@dicecho/types";
import { ScenarioList } from "@/components/Scenario/scenario-list";
import { HydrateClient, api } from '@/trpc/server';

interface ScenarioListServerProps {
  query: Partial<IModListQuery>;
}

export async function ScenarioListServer({ query }: ScenarioListServerProps) {
	const initialData = await api.scenario.list(query);

  return (
    <HydrateClient>
      <ScenarioList initialData={initialData} query={query} />
    </HydrateClient>
  );
}
