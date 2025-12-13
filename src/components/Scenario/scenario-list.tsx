"use client";
import { useEffect } from "react";
import { ScenarioCard } from "./ScenarioCard";
import { useInView } from "react-intersection-observer";

import type { IModListQuery } from "@dicecho/types";
import type { ComponentProps, FC } from "react";
import { ScenarioCardSkeleton } from "./ScenarioCardSkeleton";
import { LinkWithLng } from "@/components/Link";
import { api } from "@/trpc/react";
import type { ScenariolListApiResponse } from "@/server/api/routers/scenario";
import { cn } from "@/lib/utils";

interface ScenarioListProps extends ComponentProps<"div"> {
  initialData?: ScenariolListApiResponse;
  query?: Partial<IModListQuery>;
}

export const ScenarioList: FC<ScenarioListProps> = ({
  initialData,
  query = {},
  className,
  ...props
}) => {
  const { ref, inView } = useInView({
    rootMargin: "300px",
    threshold: 0,
  });

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    api.scenario.list.useInfiniteQuery(query, {
      initialPageParam: 1,
      initialData: initialData
        ? {
            pageParams: [],
            pages: [initialData],
          }
        : undefined,
      getNextPageParam: (lastPage) => {
        return lastPage.hasNext ? lastPage.nextCursor : undefined;
      },
      staleTime: 3600 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
    });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage().catch((err) => {
        console.error(err);
      });
    }
  }, [inView, isFetchingNextPage, fetchNextPage, hasNextPage]);

  return (
    <>
      <div
        className={cn(
          "grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4",
          className,
        )}
        {...props}
      >
        {isLoading
          ? new Array(query.pageSize ?? 12)
              .fill(0)
              .map((_, index) => <ScenarioCardSkeleton key={index} />)
          : data?.pages.flatMap((page) =>
              page.data.map((scenario) => (
                <LinkWithLng
                  href={`/scenario/${scenario._id}`}
                  key={scenario._id}
                >
                  <ScenarioCard scenario={scenario} />
                </LinkWithLng>
              )),
            )}
      </div>
      {hasNextPage && (
        <div
          className="mt-8 grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4"
          ref={ref}
        >
          {new Array(2).fill(0).map((_, index) => (
            <ScenarioCardSkeleton key={index} />
          ))}

          {new Array(2).fill(0).map((_, index) => (
            <ScenarioCardSkeleton className="hidden md:block" key={index} />
          ))}
        </div>
      )}
    </>
  );
};
