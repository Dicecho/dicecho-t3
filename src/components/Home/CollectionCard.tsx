"use client";
import { FC } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import type { CollectionDto } from "@/types/collection";
import { cn } from "@/lib/utils";

interface CollectionCardProps {
  collection: CollectionDto;
  lng: string;
  className?: string;
}

export const CollectionCard: FC<CollectionCardProps> = ({
  collection,
  lng,
  className,
}) => {
  return (
    <Link href={`/${lng}/account/${collection.user._id}/collection`}>
      <Card className={cn("overflow-hidden hover:shadow-lg transition-shadow", className)}>
        <div
          className="aspect-video w-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${collection.coverUrl})`,
          }}
        />
        <CardContent className="p-3">
          <div className="font-semibold line-clamp-1 mb-1">{collection.name}</div>
          <div className="text-xs text-muted-foreground line-clamp-2">
            {collection.description}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

