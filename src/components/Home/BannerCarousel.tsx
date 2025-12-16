"use client";
import { useRouter } from "next/navigation";
import { FC, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

import type { BannerDto } from "@/utils/api";
import { cn } from "@/lib/utils";

interface BannerProps {
  banner: BannerDto;
}

const Banner: FC<BannerProps> = ({ banner }) => {
  const router = useRouter();

  const handleClick = () => {
    if (banner.action === "link") {
      return window.open(banner.link, "_blank");
    }
    if (banner.action === "jump") {
      return router.push(banner.link);
    }
    if (banner.action === "emitEvent" && banner.eventName) {
      return window.dispatchEvent(new Event(banner.eventName));
    }
    // Gift modal functionality can be added later if needed
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "relative aspect-[21/9] w-full bg-cover bg-center overflow-hidden",
        banner.action === "" ? "cursor-default" : "cursor-pointer"
      )}
      style={{
        backgroundImage: `url(${banner.imageUrl})`,
      }}
    />
  );
};

interface BannerCarouselProps {
  banners: BannerDto[];
  className?: string;
}

export const BannerCarousel: FC<BannerCarouselProps> = ({
  banners,
  className,
}) => {
  return (
    <Carousel
      className={cn("w-full", className)}
      plugins={[
        Autoplay({
          delay: 4000,
        }),
      ]}
      opts={{
        loop: true,
      }}
    >
      <CarouselContent>
        {banners.map((banner, index) => (
          <CarouselItem key={index}>
            <Banner banner={banner} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-6" />
      <CarouselNext className="right-6" />
    </Carousel>
  );
};

