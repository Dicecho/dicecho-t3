"use client";

import { ITag } from "@/types/tag";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/react";

interface TagCardProps {
  tag: ITag;
  className?: string;
}

export function TagCard({ tag, className }: TagCardProps) {
  const { t } = useTranslation();
  
  return (
    <Card className={`${className || ""}`}>
      <div className="overflow-hidden">
        {tag.coverUrl && (
          <div
            className="h-24 w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${tag.coverUrl})` }}
          />
        )}
        <div className="p-4">
          <h3 className="mb-2 text-lg font-semibold">{tag.name}</h3>
          {tag.description && (
            <p className="text-muted-foreground mb-4 line-clamp-2 text-sm">
              {tag.description}
            </p>
          )}
          <div className="flex items-center justify-between">
            <div className="text-muted-foreground text-sm">
              {t("scenario")} {tag.modCount}
            </div>
            <Button size="sm" variant="outline">
              {t("follow")}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

