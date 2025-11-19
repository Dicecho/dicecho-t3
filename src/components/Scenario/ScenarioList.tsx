"use client";
import { useEffect } from "react";
import Link from "next/link";
import { ScenarioCard } from "./ScenarioCard";
import { useInView } from "react-intersection-observer";
import clsx from "clsx";
import { omit } from "lodash";
import { Trans } from "react-i18next";
import { useTranslation } from "@/lib/i18n/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useDicecho } from "@/hooks/useDicecho";
import { Separator } from "@/components/ui/separator";

import type { IModListQuery, ModListApiResponse } from "@dicecho/types";
import type { ComponentProps, FC } from "react";
import { ScenarioCardSkeleton } from "./ScenarioCardSkeleton";
import { Loader2 } from "lucide-react";

interface ScenarioListProps extends ComponentProps<"div"> {
  initialData?: ModListApiResponse;
  query?: Partial<IModListQuery>;
}

export const ScenarioList: FC<ScenarioListProps> = ({
  initialData,
  query = {},
  className,
  ...props
}) => {
  const { t, i18n } = useTranslation();
  const { api } = useDicecho();
  const { ref, inView } = useInView();

  const { data, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery({
    initialPageParam: 1,
    initialData: initialData
      ? {
          pageParams: [],
          pages: [initialData],
        }
      : undefined,
    queryKey: [`scenarios`, omit(query, "page")],
    queryFn: ({ pageParam }) => {
      return api.module.list({ ...query, page: pageParam });
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasNext ? lastPage.page + 1 : undefined;
    },
    getPreviousPageParam: (firstPage) => {
      return firstPage.page - 1;
    },
    staleTime: 3600 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  useEffect(() => {
    if (isLoading) return;
    if (inView && hasNextPage) {
      fetchNextPage().catch((err) => {
        console.error(err);
      });
    }
  }, [inView, isLoading, fetchNextPage, hasNextPage]);

  return (
    <>
      <div className="text-muted-foreground mt-2 flex items-center gap-2 text-sm">
        <Trans
          i18nKey="search_result"
          t={t}
          values={{
            count: isLoading ? "" : (data?.pages[0]?.totalCount ?? 0),
          }}
          components={{
            loading: isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : <></>,
          }}
        />
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
                <Link
                  href={`/${i18n.language}/scenario/${scenario._id}`}
                  key={scenario._id}
                >
                  <ScenarioCard scenario={scenario} />
                </Link>
              )),
            )}
      </div>
      {hasNextPage && (
        <div
          className="mt-8 grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4"
          ref={ref}
        >
          {new Array(query.pageSize ?? 4).fill(0).map((_, index) => (
            <ScenarioCardSkeleton key={index} />
          ))}
        </div>
      )}
    </>
  );
};
