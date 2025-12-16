"use client";
import { FC } from "react";
import { CollectionCard } from "./CollectionCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import type { CollectionDto } from "@/types/collection";

interface CollectionCardCarouselProps {
  collections: CollectionDto[];
}

export const CollectionCardCarousel: FC<CollectionCardCarouselProps> = ({
  collections,
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
        {collections.map((collection) => (
          <CarouselItem
            key={collection._id}
            className="basis-[28.57%] pl-4"
          >
            <CollectionCard collection={collection} />
          </CarouselItem>
        ))}
        {/* Spacer for right padding */}
        <CarouselItem className="basis-4 pl-0 shrink-0" />
      </CarouselContent>
    </Carousel>
  );
};
