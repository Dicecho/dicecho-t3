import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TagRelatedTagsProps {
  parents: string[];
  children: string[];
  lng: string;
}

export function TagRelatedTags({ parents, children, lng }: TagRelatedTagsProps) {
  if (parents.length === 0 && children.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Related Tags</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {parents.length > 0 && (
          <div className="space-y-2">
            <div className="text-muted-foreground text-xs uppercase tracking-wide">
              Parent Tags
            </div>
            <div className="flex flex-wrap gap-2">
              {parents.map((parent) => (
                <Link key={parent} href={`/${lng}/tag/${encodeURIComponent(parent)}`}>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                    {parent}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        )}

        {children.length > 0 && (
          <div className="space-y-2">
            <div className="text-muted-foreground text-xs uppercase tracking-wide">
              Child Tags
            </div>
            <div className="flex flex-wrap gap-2">
              {children.map((child) => (
                <Link key={child} href={`/${lng}/tag/${encodeURIComponent(child)}`}>
                  <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                    {child}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
