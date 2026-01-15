"use client";

import { useParams } from "next/navigation";

import { HeaderBack } from "@/components/Header/HeaderBack";
import { MobileHeader } from "@/components/Header/MobileHeader";
import { CollectionActions } from "@/components/Collection/CollectionActions";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { cn } from "@/lib/utils";

import type { CollectionDto } from "@/types/collection";

interface CollectionDetailHeaderProps {
  title: string;
  collection?: CollectionDto;
}

export const CollectionDetailHeader = ({
  title,
  collection,
}: CollectionDetailHeaderProps) => {
  const { ref, isIntersecting } = useIntersectionObserver<HTMLDivElement>();
  const { lng } = useParams<{ lng: string }>();

  return (
    <>
      <div ref={ref} className="absolute top-[200px] h-px w-full md:hidden" />

      <MobileHeader
        left={<HeaderBack fallback={`/${lng}/collection`} />}
        right={collection && <CollectionActions collection={collection} />}
        className={cn(
          "fixed items-center justify-center transition-colors duration-200",
          isIntersecting &&
            "bg-transparent text-primary-foreground shadow-none",
        )}
      >
        <div
          className={cn(
            "truncate text-center text-sm transition-opacity duration-200",
            isIntersecting && "opacity-0",
          )}
        >
          {title}
        </div>
      </MobileHeader>
    </>
  );
};
