"use client";

import { TopicCard } from "@/components/Search/TopicCard";
import { TopicCardSkeleton } from "@/components/Search/TopicCardSkeleton";
import { Empty } from "@/components/Empty";
import { useTranslation } from "@/lib/i18n/react";
import { useDicecho } from "@/hooks/useDicecho";
import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";

export default function TopicSearchPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const lng = params.lng as string;
  const keyword = searchParams.get("keyword") || "";
  const { t } = useTranslation();
  const { api } = useDicecho();

  // Fetch topics
  const { data: topicsData, isLoading } = useQuery({
    queryKey: ["search", "topics", keyword],
    queryFn: () => api.search.topic({ keyword, pageSize: 100 }),
    enabled: !!keyword,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <TopicCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!topicsData || topicsData.totalCount === 0) {
    return <Empty emptyText={t("search_no_topic")} />;
  }

  return (
    <div className="flex flex-col gap-4">
      {topicsData.data.map((topic) => (
        <TopicCard
          key={topic._id}
          topic={topic}
          lng={lng}
          showDomain
        />
      ))}
    </div>
  );
}
