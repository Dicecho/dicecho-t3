import { getDicechoServerApi } from "@/server/dicecho";
import { getTranslation } from "@/lib/i18n";
import { ScenarioDetailHeader } from "../header";
import { ScenarioHeader } from "../scenario-header";
import { notFound } from "next/navigation";
import { TopicList } from "@/components/forum/topic-list";
import { CreateTopicButton } from "./create-topic-button";

const ScenarioTopicPage = async ({
  params,
}: {
  params: Promise<{ lng: string; id: string }>;
}) => {
  const { lng, id } = await params;
  const api = await getDicechoServerApi();
  const scenario = await api.module
    .detail(id, { revalidate: 300 })
    .catch(() => null);

  if (!scenario) {
    return notFound();
  }

  const { t } = await getTranslation(lng);

  return (
    <>
      <ScenarioDetailHeader title={t("topics")} />
      <div className="md:container">
        <ScenarioHeader lng={lng} scenario={scenario} currentTab="topic" />

        <div className="mt-4 flex flex-col gap-4">
          <div className="flex max-md:hidden">
            <CreateTopicButton
              className="ml-auto"
              scenario={{
                _id: scenario._id,
                title: scenario.title,
                description: scenario.description,
                coverUrl: scenario.coverUrl,
                rateAvg: scenario.rateAvg,
                rateCount: scenario.rateCount,
              }}
            />
          </div>
          <TopicList
            lng={lng}
            query={{ modId: scenario._id, pageSize: 10 }}
            emptyText={t("topic_empty_scenario")}
          />
        </div>
      </div>
    </>
  );
};

export default ScenarioTopicPage;
