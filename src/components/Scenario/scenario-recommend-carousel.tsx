"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { ScenarioCard } from "@/components/Scenario/ScenarioCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useDicecho } from "@/hooks/useDicecho";
import { useTranslation } from "@/lib/i18n/react";

import type { ModListApiResponse } from "@dicecho/types";

interface ScenarioRecommendCarouselProps {
  scenarioId: string;
}

function CarouselSkeleton() {
  return (
    <div className="flex gap-4 overflow-hidden px-4">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div key={idx} className="w-[28%] shrink-0">
          <Skeleton className="mb-1 aspect-[3/4] rounded-lg" />
          <Skeleton className="mb-1 h-4 w-3/4" />
          <Skeleton className="mb-1 h-3 w-1/2" />
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  );
}

export function ScenarioRecommendCarousel({
  scenarioId,
}: ScenarioRecommendCarouselProps) {
  const { api } = useDicecho();
  const { t, i18n } = useTranslation();

  const { data, isLoading } = useQuery<ModListApiResponse>({
    queryKey: ["scenario", scenarioId, "recommend"],
    queryFn: () => api.module.recommend(scenarioId),
    staleTime: 10 * 60 * 1000,
  });

  if (isLoading) {
    return <CarouselSkeleton />;
  }

  if (!data || data.data.length === 0) {
    return null;
  }

  return (
    <Carousel
      opts={{
        align: "start",
        containScroll: "trimSnaps",
        dragFree: true,
      }}
    >
      <CarouselContent className="ml-0">
        {data.data.slice(0, 6).map((scenario) => (
          <CarouselItem key={scenario._id} className="basis-[28.57%] pl-4">
            <Link href={`/${i18n.language}/scenario/${scenario._id}`}>
              <ScenarioCard scenario={scenario} compact />
            </Link>
          </CarouselItem>
        ))}
        <CarouselItem className="shrink-0 basis-4 pl-0" />
      </CarouselContent>
    </Carousel>
  );
}
