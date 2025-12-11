"use client";
import { useEffect, useState } from "react";
import { ScenarioCard } from "./ScenarioCard";
import { useInView } from "react-intersection-observer";
import clsx from "clsx";
import { Trans } from "react-i18next";
import { useTranslation } from "@/lib/i18n/react";
import { Separator } from "@/components/ui/separator";

import type { IModListQuery } from "@dicecho/types";
import type { ComponentProps, FC } from "react";
import { ScenarioCardSkeleton } from "./ScenarioCardSkeleton";
import { Loader2 } from "lucide-react";
import { LinkWithLng } from "../Link";
import { ScenarioSort } from "./scenario-sort";
import { api } from "@/trpc/react";
import type { ScenariolListApiResponse } from "@/server/api/routers/scenario";

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
  const { t } = useTranslation();
  const { ref, inView } = useInView({
    rootMargin: '300px',
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
      fetchNextPage()
        .catch((err) => {
          console.error(err);
        });
    }
  }, [inView, isFetchingNextPage, fetchNextPage, hasNextPage]);

  return (
    <>
      <div className="flex items-center gap-2 text-sm">
        <div className="flex items-center gap-2">
          <Trans
            className="text-muted-foreground"
            i18nKey="search_result"
            t={t}
            values={{
              count: isLoading ? "" : (data?.pages[0]?.totalCount ?? 0),
            }}
            components={{
              loading: isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <></>
              ),
            }}
          />
        </div>
        <ScenarioSort className="ml-auto" />
      </div>
      <Separator className="mt-2 mb-4" />
      <div
        className={clsx(
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
          {new Array(4).fill(0).map((_, index) => (
            <ScenarioCardSkeleton key={index} />
          ))}
        </div>
      )}
    </>
  );
};
