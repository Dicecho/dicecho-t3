import type { IModListQuery } from "@dicecho/types";
import { ScenarioList } from "@/components/Scenario/scenario-list";
import { ScenarioListHeader } from "@/components/Scenario/scenario-list-header";
import { HydrateClient, api } from '@/trpc/server';

interface ScenarioListServerProps {
  query: Partial<IModListQuery>;
}

export async function ScenarioListServer({ query }: ScenarioListServerProps) {
  console.log('query', query);
	const initialData = await api.scenario.list(query);

  return (
    <HydrateClient>
      <ScenarioListHeader totalCount={initialData.totalCount} query={query} />
      <ScenarioList initialData={initialData} query={query} />
    </HydrateClient>
  );
}
