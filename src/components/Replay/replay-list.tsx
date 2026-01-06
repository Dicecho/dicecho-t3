"use client";

import { useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { omit } from "lodash";
import { useDicecho } from "@/hooks/useDicecho";
import { ReplayItem } from "./replay-item";
import { ReplayItemSkeleton } from "./replay-item-skeleton";
import { LinkWithLng } from "@/components/Link";
import type { ReplayListQuery, ReplayListResponse } from "@/types/replay";
import type { ComponentProps, FC } from "react";
import { cn } from "@/lib/utils";

interface ReplayListProps extends ComponentProps<"div"> {
  initialData?: ReplayListResponse;
  query?: Partial<ReplayListQuery>;
}

export const ReplayList: FC<ReplayListProps> = ({
  initialData,
  query = {},
  className,
  ...props
}) => {
  const { api } = useDicecho();
  const { ref, inView } = useInView({ rootMargin: "300px" });

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      initialPageParam: 1,
      initialData: initialData
        ? { pageParams: [], pages: [initialData] }
        : undefined,
      queryKey: ["replays", omit(query, "page")],
      queryFn: ({ pageParam }) => api.replay.list({ ...query, page: pageParam, pageSize: query.pageSize ?? 12 }),
      getNextPageParam: (lastPage) =>
        lastPage.hasNext ? lastPage.page + 1 : undefined,
      staleTime: 3600 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
    });

  useEffect(() => {
    if (isLoading || isFetchingNextPage) {
      return;
    }
    if (inView && hasNextPage) {
      fetchNextPage().catch(console.error);
    }
  }, [inView, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage]);

  return (
    <>
      <div
        className={cn(
          "grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
          className
        )}
        {...props}
      >
        {isLoading
          ? Array.from({ length: 12 }).map((_, i) => (
              <ReplayItemSkeleton key={i} />
            ))
          : data?.pages.flatMap((page) =>
              page.data.map((replay) => (
                <LinkWithLng href={`/replay/${replay.bvid}`} key={replay.bvid}>
                  <ReplayItem replay={replay} />
                </LinkWithLng>
              ))
            )}
      </div>

      {hasNextPage && (
        <div
          ref={ref}
          className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <ReplayItemSkeleton key={i} />
          ))}
        </div>
      )}
    </>
  );
};
