"use client";
import { RateItem } from "./RateItem";
import clsx from "clsx";
import { useQuery } from "@tanstack/react-query";
import { useDicecho } from "@/hooks/useDicecho";
import { Separator } from "@/components/ui/separator";

import type { IRateListQuery, IRateListApiResponse } from "@dicecho/types";
import type { ComponentProps, FC } from "react";

interface RateListProps extends ComponentProps<"div"> {
  initialData: IRateListApiResponse;
  query?: Partial<IRateListQuery>;
}

export const RateList: FC<RateListProps> = ({
  initialData,
  query = {},
  className,
  ...props
}) => {
  const { api } = useDicecho();

  const { data } = useQuery({
    queryKey: ["rate", query],
    queryFn: () => api.rate.list(query),
    initialData,
    staleTime: 3600 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  return (
    <div className={clsx("flex flex-col gap-4", className)} {...props}>
      {data.data.map((rate, i) => (
        <div key={rate._id}>
          <RateItem rate={rate} />
          {i !== data.data.length - 1 && <Separator />}
        </div>
      ))}
    </div>
  );
};
