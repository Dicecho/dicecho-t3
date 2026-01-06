"use client";

import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useDicecho } from "@/hooks/useDicecho";
import { TopicCard } from "@/components/Search/TopicCard";
import { TopicCardSkeleton } from "@/components/Search/TopicCardSkeleton";
import { Empty } from "@/components/Empty";
import { useTranslation } from "@/lib/i18n/react";
import type { TopicListQuery, ITopicDto } from "@/types/topic";
import type { PaginatedResponse } from "@dicecho/types";
import { cn } from "@/lib/utils";

interface TopicListProps {
  lng: string;
  query?: Partial<TopicListQuery>;
  initialData?: PaginatedResponse<ITopicDto>;
  showDomain?: boolean;
  emptyText?: string;
  className?: string;
}

export function TopicList({
  lng,
  query = {},
  initialData,
  showDomain = false,
  emptyText,
  className,
}: TopicListProps) {
  const { api } = useDicecho();
  const { t } = useTranslation();
  const { ref, inView } = useInView({
    rootMargin: "300px",
    threshold: 0,
  });

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["topics", query],
    queryFn: async ({ pageParam = 1 }) => {
      return api.topic.list({
        ...query,
        page: pageParam,
        pageSize: query.pageSize ?? 20,
      });
    },
    initialPageParam: 1,
    initialData: initialData
      ? {
          pageParams: [1],
          pages: [initialData],
        }
      : undefined,
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.reduce((acc, page) => acc + page.data.length, 0);
      return totalFetched < lastPage.totalCount ? allPages.length + 1 : undefined;
    },
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage().catch(console.error);
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className={cn("flex flex-col gap-4", className)}>
        {Array.from({ length: query.pageSize ?? 10 }).map((_, i) => (
          <TopicCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const allTopics = data?.pages.flatMap((page) => page.data) ?? [];

  if (allTopics.length === 0) {
    return <Empty emptyText={emptyText ?? t("topic_empty")} />;
  }

  return (
    <>
      <div className={cn("flex flex-col gap-4", className)}>
        {allTopics.map((topic) => (
          <TopicCard
            key={topic._id}
            topic={topic}
            lng={lng}
            showDomain={showDomain}
          />
        ))}
      </div>
      {hasNextPage && (
        <div className="mt-4 flex flex-col gap-4" ref={ref}>
          {Array.from({ length: 3 }).map((_, i) => (
            <TopicCardSkeleton key={i} />
          ))}
        </div>
      )}
    </>
  );
}
