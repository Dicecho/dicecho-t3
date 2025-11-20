"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, MessageSquare } from "lucide-react";

export const CollectionDetailSkeleton = () => {
  return (
    <div className="space-y-4">
      {/* Collection Header */}
      <Card>
        <CardContent className="flex w-full gap-4">
          <Skeleton className="aspect-square h-40 w-40 rounded-md" />

          <div className="flex-1 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <CardTitle className="text-2xl">
                    <Skeleton className="h-5 w-2/3" />
                  </CardTitle>
                  <Skeleton className="h-4 w-1/4" />
                </div>
                <CardDescription>
                  <Skeleton className="h-4 w-full" />
                </CardDescription>
              </div>
            </div>

            {/* Creator */}
            <Skeleton className="h-4 w-full" />
            {/* Description */}
            <Skeleton className="h-4 w-full" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="px-6">
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex gap-4">
                <Skeleton className="h-32 w-24 flex-none rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
