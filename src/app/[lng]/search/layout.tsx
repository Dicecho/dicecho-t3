"use client";

import { SearchTabs } from "@/components/Search/SearchTabs";
import { useTranslation } from "@/lib/i18n/react";
import { useDicecho } from "@/hooks/useDicecho";
import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";
import { Empty } from "@/components/Empty";

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const searchParams = useSearchParams();
  const lng = params.lng as string;
  const keyword = searchParams.get("keyword") || "";
  const { t } = useTranslation();
  const { api } = useDicecho();

  // Fetch counts for tabs
  const { data: scenariosCount } = useQuery({
    queryKey: ["search", "scenarios", "count", keyword],
    queryFn: () => api.module.list({ keyword, pageSize: 1 }),
    enabled: !!keyword,
  });

  const { data: tagsCount } = useQuery({
    queryKey: ["search", "tags", "count", keyword],
    queryFn: () => api.search.tag({ keyword, pageSize: 1 }),
    enabled: !!keyword,
  });

  const { data: topicsCount } = useQuery({
    queryKey: ["search", "topics", "count", keyword],
    queryFn: () => api.search.topic({ keyword, pageSize: 1 }),
    enabled: !!keyword,
  });

  const { data: usersCount } = useQuery({
    queryKey: ["search", "users", "count", keyword],
    queryFn: () => api.search.user({ keyword, pageSize: 1 }),
    enabled: !!keyword,
  });

  if (!keyword) {
    return (
      <div className="container mx-auto py-8">
        <Empty emptyText={t("search_no_keyword")} />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {/* Upper part: Title and Tabs */}
      <div className="mb-6">
        <h1 className="mb-4 text-2xl font-bold">
          {t("search_result_for")}: &quot;{keyword}&quot;
        </h1>
        <SearchTabs
          lng={lng}
          counts={{
            scenarios: scenariosCount?.totalCount || 0,
            tags: tagsCount?.totalCount || 0,
            topics: topicsCount?.totalCount || 0,
            users: usersCount?.totalCount || 0,
          }}
        />
      </div>

      {/* Lower part: Search results */}
      {children}
    </div>
  );
}

