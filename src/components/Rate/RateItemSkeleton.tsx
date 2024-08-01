"use client";
import React from "react";
import { Card } from "../ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const RateItemSkeleton: React.FC = () => {
  return (
    <Card className={"flex flex-col gap-4 p-4"}>
      <div className={"flex items-baseline gap-2"}>
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-sm" />
        <Skeleton className="h-6 w-12 rounded-sm" />

        <Skeleton className="ml-auto h-6 w-24 rounded-sm" />
      </div>

      <div className="rating">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="mask mask-star h-6 w-6" />
        ))}
      </div>

      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-sm" />
        <Skeleton className="h-6 w-24 rounded-sm" />
      </div>

      <div className="flex flex-col gap-2">
        <Skeleton className="h-[20px] w-full rounded-sm" />
        <Skeleton className="h-[20px] w-1/2 rounded-sm" />
        <Skeleton className="h-[20px] w-full rounded-sm" />
        <Skeleton className="h-[20px] w-full rounded-sm" />
        <Skeleton className="h-[20px] w-1/3 rounded-sm" />
      </div>
    </Card>
  );
};
