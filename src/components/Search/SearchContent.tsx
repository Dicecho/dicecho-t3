"use client";

import { ScenarioCard } from "@/components/Scenario/ScenarioCard";
import { ScenarioCardSkeleton } from "@/components/Scenario/ScenarioCardSkeleton";
import { TagCard } from "@/components/Search/TagCard";
import { TagCardSkeleton } from "@/components/Search/TagCardSkeleton";
import { TopicCard } from "@/components/Search/TopicCard";
import { TopicCardSkeleton } from "@/components/Search/TopicCardSkeleton";
import { UserInfoCard } from "@/components/User/user-info-card";
import { UserInfoCardSkeleton } from "@/components/User/user-info-card-skeleton";
import { Empty } from "@/components/Empty";
import { useTranslation } from "@/lib/i18n/react";
import { useDicecho } from "@/hooks/useDicecho";
import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card } from "../ui/card";

export function SearchContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const lng = params.lng as string;
  const keyword = searchParams.get("keyword") || "";
  const { t } = useTranslation();
  const { api } = useDicecho();

  // Fetch all search results in parallel
  const { data: scenariosData, isLoading: scenariosLoading } = useQuery({
    queryKey: ["search", "scenarios", keyword],
    queryFn: () => api.module.list({ keyword, pageSize: 8 }),
    enabled: !!keyword,
  });

  const { data: tagsData, isLoading: tagsLoading } = useQuery({
    queryKey: ["search", "tags", keyword],
    queryFn: () => api.search.tag({ keyword, pageSize: 4 }),
    enabled: !!keyword,
  });

  const { data: topicsData, isLoading: topicsLoading } = useQuery({
    queryKey: ["search", "topics", keyword],
    queryFn: () => api.search.topic({ keyword, pageSize: 5 }),
    enabled: !!keyword,
  });

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ["search", "users", keyword],
    queryFn: () => api.search.user({ keyword, pageSize: 6 }),
    enabled: !!keyword,
  });

  const allLoaded =
    !scenariosLoading && !tagsLoading && !topicsLoading && !usersLoading;
  const isEmpty =
    allLoaded &&
    (scenariosData?.totalCount || 0) === 0 &&
    (tagsData?.totalCount || 0) === 0 &&
    (topicsData?.totalCount || 0) === 0 &&
    (usersData?.totalCount || 0) === 0;

  if (isEmpty) {
    return <Empty emptyText={t("search_no_result")} />;
  }

  return (
    <div className="space-y-8">
      {/* Scenarios Section */}
      {scenariosLoading ? (
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-semibold">
              {t("search_tab_scenario")}
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ScenarioCardSkeleton key={i} />
            ))}
          </div>
        </section>
      ) : (
        scenariosData &&
        scenariosData.totalCount > 0 && (
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {t("search_tab_scenario")} ({scenariosData.totalCount})
              </h2>
              {scenariosData.totalCount > 8 && (
                <Link
                  href={`/${lng}/search/scenario?keyword=${keyword}`}
                  className="text-primary flex items-center gap-1 text-sm hover:underline"
                >
                  {t("search_more")} <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
              {scenariosData.data.map((scenario) => (
                <Link
                  key={scenario._id}
                  href={`/${lng}/scenario/${scenario._id}`}
                >
                  <ScenarioCard scenario={scenario} />
                </Link>
              ))}
            </div>
          </section>
        )
      )}

      {/* Tags Section */}
      {tagsLoading ? (
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-semibold">{t("search_tab_tag")}</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <TagCardSkeleton key={i} />
            ))}
          </div>
        </section>
      ) : (
        tagsData &&
        tagsData.totalCount > 0 && (
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {t("search_tab_tag")} ({tagsData.totalCount})
              </h2>
              {tagsData.totalCount > 4 && (
                <Link
                  href={`/${lng}/search/tag?keyword=${keyword}`}
                  className="text-primary flex items-center gap-1 text-sm hover:underline"
                >
                  {t("search_more")} <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {tagsData.data.map((tag) => (
                <Link key={tag._id} href={`/${lng}/tag/${tag._id}`}>
                  <TagCard tag={tag} />
                </Link>
              ))}
            </div>
          </section>
        )
      )}

      {/* Topics Section */}
      {topicsLoading ? (
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-semibold">{t("search_tab_topic")}</h2>
          </div>
          <div className="flex flex-col gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <TopicCardSkeleton key={i} />
            ))}
          </div>
        </section>
      ) : (
        topicsData &&
        topicsData.totalCount > 0 && (
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {t("search_tab_topic")} ({topicsData.totalCount})
              </h2>
              {topicsData.totalCount > 5 && (
                <Link
                  href={`/${lng}/search/topic?keyword=${keyword}`}
                  className="text-primary flex items-center gap-1 text-sm hover:underline"
                >
                  {t("search_more")} <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
            <div className="flex flex-col gap-4">
              {topicsData.data.map((topic) => (
                <TopicCard key={topic._id} topic={topic} lng={lng} showDomain />
              ))}
            </div>
          </section>
        )
      )}

      {/* Users Section */}
      {usersLoading ? (
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-semibold">{t("search_tab_user")}</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <UserInfoCardSkeleton key={i} />
            ))}
          </div>
        </section>
      ) : (
        usersData &&
        usersData.totalCount > 0 && (
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {t("search_tab_user")} ({usersData.totalCount})
              </h2>
              {usersData.totalCount > 6 && (
                <Link
                  href={`/${lng}/search/user?keyword=${keyword}`}
                  className="text-primary flex items-center gap-1 text-sm hover:underline"
                >
                  {t("search_more")} <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {usersData.data.map((user) => (
                <Link key={user._id} href={`/${lng}/account/${user._id}`}>
                  <UserInfoCard
                    className="p-0 shadow-md hover:shadow-lg"
                    key={user._id}
                    user={user}
                  />
                </Link>
              ))}
            </div>
          </section>
        )
      )}
    </div>
  );
}
