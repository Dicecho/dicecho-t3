"use client";

import type { FC, ComponentProps } from "react";
import type { CollectionDto } from "@/types/collection";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/react";
import { LinkWithLng } from "@/components/Link";

interface CollectionItemProps extends ComponentProps<"div"> {
  collection: CollectionDto;
  showLink?: boolean;
}

export const CollectionItem: FC<CollectionItemProps> = ({
  collection,
  showLink = true,
  className,
  ...props
}) => {
  const { t } = useTranslation();

  const content = (
    <div
      className={cn(
        "flex items-center gap-3 rounded-md transition-colors",
        showLink && "cursor-pointer group ",
        className,
      )}
      {...props}
    >
      <div
        className="h-10 w-10 shrink-0 rounded bg-muted bg-cover bg-center"
        style={{
          backgroundImage: collection.coverUrl
            ? `url(${collection.coverUrl}?width=80&height=80)`
            : undefined,
        }}
      >
        {!collection.coverUrl && (
          <div className="flex h-full w-full items-center justify-center text-lg font-medium text-muted-foreground">
            {collection.name[0]}
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium group-hover:text-primary transition-colors" title={collection.name}>
          {collection.name}
        </div>
        <div className="text-xs text-muted-foreground">
          {t(`collection_access_${collection.accessLevel}`)} · {t("collection_items_count", { count: collection.items.length })}
        </div>
      </div>
    </div>
  );

  if (!showLink) {
    return content;
  }

  return (
    <LinkWithLng href={`/collection/${collection._id}`}>
      {content}
    </LinkWithLng>
  );
};
