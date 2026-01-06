"use client";

import type { FC } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { ReplayItem } from "./replay-item";
import { LinkWithLng } from "@/components/Link";
import type { IReplayDto } from "@/types/replay";

interface ReplayCarouselProps {
  replays: IReplayDto[];
}

export const ReplayCarousel: FC<ReplayCarouselProps> = ({ replays }) => {
  if (replays.length === 0) {
    return null;
  }

  return (
    <Carousel
      opts={{ align: "start", loop: true }}
      plugins={[Autoplay({ delay: 5000, stopOnInteraction: true })]}
      className="w-full"
    >
      <CarouselContent className="-ml-4">
        {replays.map((replay) => (
          <CarouselItem
            key={replay.bvid}
            className="basis-full pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
          >
            <LinkWithLng href={`/replay/${replay.bvid}`}>
              <ReplayItem replay={replay} />
            </LinkWithLng>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="max-md:hidden left-0" />
      <CarouselNext className="max-md:hidden right-0" />
    </Carousel>
  );
};
