import { ITag } from "@/types/tag";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface TagDetailHeaderProps {
  tag: ITag;
}

export function TagDetailHeader({ tag }: TagDetailHeaderProps) {
  return (
    <Card>
      <CardContent className="flex w-full gap-4">
        {tag.coverUrl && (
          <Image
            src={tag.coverUrl}
            alt={tag.name}
            className="aspect-square h-32 w-32 rounded-md object-cover"
            width={128}
            height={128}
            priority
          />
        )}

        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle className="text-2xl">{tag.name}</CardTitle>
            {tag.alias.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {tag.alias.map((alias) => (
                  <Badge key={alias} variant="outline">
                    {alias}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {tag.description && (
            <p className="text-muted-foreground text-sm leading-relaxed">
              {tag.description}
            </p>
          )}

          <div className="text-muted-foreground flex items-center gap-4 text-sm">
            <span>{tag.modCount} scenarios</span>
            <span>{tag.topicCount} topics</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
