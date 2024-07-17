"use client";
import clsx from "clsx";
import { ComponentPropsWithoutRef, FC, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

export type AlbumProps = ComponentPropsWithoutRef<"div"> & {
  imageUrls: string[];
};
export const Album: FC<AlbumProps> = ({ imageUrls, className, ...props }) => {
  return (
    <PhotoProvider>
      <Carousel {...props} className={clsx("", className)}>
        <CarouselContent>
          {imageUrls.map((url) => (
            <CarouselItem key={url}>
              <PhotoView src={url} width={100} height={100}>
                <div
                  style={{ backgroundImage: `url(${url})` }}
                  className="aspect-video w-full bg-cover bg-center"
                />
              </PhotoView>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-6" />
        <CarouselNext className="right-6" />
      </Carousel>
    </PhotoProvider>
  );
};
