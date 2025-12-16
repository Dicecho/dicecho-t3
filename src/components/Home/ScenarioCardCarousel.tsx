"use client";
import Link from "next/link";
import { FC } from "react";
import { ScenarioCard } from "@/components/Scenario/ScenarioCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import type { IModDto } from "@dicecho/types";

interface ScenarioCardCarouselProps {
  scenarios: IModDto[];
  lng: string;
}

export const ScenarioCardCarousel: FC<ScenarioCardCarouselProps> = ({
  scenarios,
  lng,
}) => {
  return (
    <Carousel
      opts={{
        align: "start",
        containScroll: "trimSnaps",
        dragFree: true,
      }}
    >
      <CarouselContent className="ml-0">
        {scenarios.map((scenario) => (
          <CarouselItem
            key={scenario._id}
            className="basis-[28.57%] pl-4"
          >
            <Link href={`/${lng}/scenario/${scenario._id}`}>
              <ScenarioCard scenario={scenario} compact />
            </Link>
          </CarouselItem>
        ))}
        {/* Spacer for right padding */}
        <CarouselItem className="basis-4 pl-0 shrink-0" />
      </CarouselContent>
    </Carousel>
  );
};
