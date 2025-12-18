"use client";
import { FC } from "react";
import type { CollectionDto } from "@/types/collection";
import { cn } from "@/lib/utils";
import { LinkWithLng } from "../Link";

interface CollectionCardProps {
  collection: CollectionDto;
  className?: string;
}

export const CollectionCard: FC<CollectionCardProps> = ({
  collection,
  className,
}) => {
  return (
    <LinkWithLng href={`/collection/${collection._id}`}>
      <div className={cn("overflow-hidden space-y-1", className)}>
        <div
          className="aspect-square w-full bg-cover bg-center rounded-sm"
          style={{
            backgroundImage: `url(${collection.coverUrl}?width=300&height=300)`,
          }}
        />
        <div className="text-sm line-clamp-2">{collection.name}</div>
      </div>
    </LinkWithLng>
  );
};

