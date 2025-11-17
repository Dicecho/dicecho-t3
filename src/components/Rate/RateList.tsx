"use client";
import { useState } from "react";
import clsx from "clsx";
import { useQuery } from "@tanstack/react-query";
import { useDicecho } from "@/hooks/useDicecho";
import { ControllablePagination } from "@/components/Pagination";
import { Empty } from "@/components/Empty";
import { RateItem } from "./RateItem";
import { RateItemSkeleton } from "./RateItemSkeleton";

import type { IRateListQuery, IRateListApiResponse } from "@dicecho/types";
import type { ComponentProps, FC } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { useTranslation } from "@/lib/i18n/react";

interface RateListProps extends ComponentProps<"div"> {
  initialData?: IRateListApiResponse;
  query?: Omit<Partial<IRateListQuery>, "page" | "pageSize">;
}

export const RateList: FC<RateListProps> = ({
  initialData,
  query = {},
  className,
  ...props
}) => {
  const { t } = useTranslation();
  const [pageParams, setPageParams] = useState<{
    page: number;
    pageSize?: number;
  }>({ page: 1 });

  const { api } = useDicecho();
  const { data, isLoading, fetchStatus } = useQuery({
    queryKey: ["rate", "list", query, pageParams],
    queryFn: () => api.rate.list({ ...query, ...pageParams }),
    initialData: () => {
      if (pageParams.page === 1) {
        return initialData;
      }
    },
    placeholderData: (previousValue) => {
      return previousValue;
    },
    staleTime: 3600 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  return (
    <div className={clsx("flex flex-col gap-2", className)} {...props}>

      {!isLoading && data?.data.length === 0 && (
        <Card className="p-16">
          <Empty>
            <Button color="primary">
              {t("Rate.empty_placeholder_action")}
            </Button>
          </Empty>
        </Card>
      )}

      {fetchStatus === "fetching"
        ? new Array(data?.pageSize ?? 10)
            .fill(0)
            .map((_, index) => <RateItemSkeleton key={index} />)
        : data?.data.map((rate) => <RateItem rate={rate} key={rate._id} />)}

      {data && data.totalCount > data.pageSize && (
        <ControllablePagination
          current={data.page}
          total={Math.ceil(data.totalCount / data.pageSize)}
          onChange={(page) => setPageParams((params) => ({ ...params, page }))}
        />
      )}
    </div>
  );
};
