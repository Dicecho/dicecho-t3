"use client";

import { useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { omit } from "lodash";
import { Trans } from "react-i18next";
import { useTranslation } from "@/lib/i18n/react";
import { useDicecho } from "@/hooks/useDicecho";
import { CollectionCard } from "@/components/Home/CollectionCard";
import { CollectionCardSkeleton } from "./CollectionCardSkeleton";
import type {
  CollectionListQuery,
  CollectionListResponse,
} from "@/types/collection";
import type { ComponentProps, FC } from "react";
import { Loader2 } from "lucide-react";

interface CollectionListProps extends ComponentProps<"div"> {
  initialData?: CollectionListResponse;
  query?: Partial<CollectionListQuery>;
}

export const CollectionList: FC<CollectionListProps> = ({
  initialData,
  query = {},
  className,
  ...props
}) => {
  const { t } = useTranslation();
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
    queryKey: [`collections`, omit(query, "page")],
    queryFn: ({ pageParam }) => {
      return api.collection.list({ ...query, page: pageParam });
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasNext ? lastPage.page + 1 : undefined;
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
          i18nKey="collection_search_result"
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

      <div
        className={`mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 ${className ?? ""}`}
        {...props}
      >
        {isLoading
          ? new Array(12)
              .fill(0)
              .map((_, i) => <CollectionCardSkeleton key={i} />)
          : data?.pages.flatMap((page) =>
              page.data.map((collection) => (
                <CollectionCard
                  key={collection._id}
                  collection={collection}
                />
              )),
            )}
      </div>

      {hasNextPage && (
        <div ref={ref} className="mt-4">
          <CollectionCardSkeleton />
        </div>
      )}
    </>
  );
};