"use client";
import clsx from "clsx";
import { useState, useEffect, useCallback } from "react";
import type { ComponentPropsWithoutRef, FC } from "react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

export type AlbumProps = ComponentPropsWithoutRef<"div"> & {
  imageUrls: string[];
};
export const Album: FC<AlbumProps> = ({ imageUrls, className, ...props }) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const onSelect = useCallback(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
  }, [api]);

  useEffect(() => {
    if (!api) return;
    onSelect();
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api, onSelect]);

  return (
    <div className={clsx("", className)}>
      <Carousel
        {...props}
        setApi={setApi}
        opts={{
          align: "center",
        }}
      >
        <CarouselContent className="max-md:ml-0">
          {imageUrls.map((url, index) => (
            <CarouselItem
              key={url}
              className={clsx(
                "max-md:basis-[85%] max-md:pl-2 md:basis-full",
                index === 0 && "max-md:ml-4",
                index === imageUrls.length - 1 && "max-md:mr-4",
              )}
            >
              <PhotoView src={url} width={100} height={100}>
                <div
                  style={{ backgroundImage: `url(${url})` }}
                  className="aspect-video w-full cursor-pointer rounded-lg bg-cover bg-center transition-all hover:brightness-75"
                />
              </PhotoView>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-6 max-md:hidden" />
        <CarouselNext className="right-6 max-md:hidden" />
      </Carousel>

      {imageUrls.length > 1 && (
        <div className="mt-2 hidden gap-2 overflow-x-auto md:flex">
          {imageUrls.map((url, index) => (
            <button
              key={url}
              onClick={() => api?.scrollTo(index)}
              className={clsx(
                "h-16 w-24 shrink-0 cursor-pointer rounded-sm bg-cover bg-center transition-all",
                current !== index && "opacity-60 hover:opacity-100"
              )}
              style={{ backgroundImage: `url(${url})` }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
