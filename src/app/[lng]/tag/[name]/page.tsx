import { ScenarioList } from "@/components/Scenario/scenario-list";
import { ScenarioCardSkeleton } from "@/components/Scenario/ScenarioCardSkeleton";
import { HydrateClient, api } from "@/trpc/server";
import { Empty } from "@/components/Empty";
import { getTranslation } from "@/lib/i18n";

function TagScenariosSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <ScenarioCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default async function TagDetailPage({
  params,
}: {
  params: Promise<{ lng: string; name: string }>;
}) {
  const { lng, name } = await params;
  const decodedName = decodeURIComponent(name);
  const { t } = await getTranslation(lng);

  const query = {
    tags: [decodedName],
    pageSize: 20,
  };

  const initialData = await api.scenario.list(query);

  if (initialData.totalCount === 0) {
    return <Empty emptyText={t("search_no_scenario")} />;
  }

  return (
    <HydrateClient>
      <ScenarioList initialData={initialData} query={query} />
    </HydrateClient>
  );
}
