"use client";

import type { FC } from "react";
import { useRouter } from "next/navigation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";
import type { IReplayDto } from "@/types/replay";

interface ReplayBannerItemProps {
  replay: IReplayDto;
}

const ReplayBannerItem: FC<ReplayBannerItemProps> = ({ replay }) => {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/replay/${replay.bvid}`)}
      className="relative aspect-[21/9] w-full cursor-pointer overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${replay.coverUrl})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute bottom-4 left-4 right-4">
        <h3 className="line-clamp-1 text-lg font-semibold text-white md:text-xl">
          {replay.title}
        </h3>
        <p className="text-sm text-white/80">{replay.owner.name}</p>
      </div>
    </div>
  );
};

interface ReplayBannerProps {
  replays: IReplayDto[];
  className?: string;
}

export const ReplayBanner: FC<ReplayBannerProps> = ({ replays, className }) => {
  if (replays.length === 0) {
    return null;
  }

  return (
    <Carousel
      className={cn("w-full", className)}
      plugins={[Autoplay({ delay: 4000 })]}
      opts={{ loop: true }}
    >
      <CarouselContent>
        {replays.map((replay) => (
          <CarouselItem key={replay.bvid}>
            <ReplayBannerItem replay={replay} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-6 max-md:hidden" />
      <CarouselNext className="right-6 max-md:hidden" />
    </Carousel>
  );
};
