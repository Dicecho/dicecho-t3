"use client";

import { usePathname } from "next/navigation";
import { LinkWithLng } from "@/components/Link/LinkWithLng";
import { cn } from "@/lib/utils";

interface TagTabsProps {
  tagName: string;
  lng: string;
  modCount: number;
  topicCount: number;
}

export function TagTabs({ tagName, lng, modCount, topicCount }: TagTabsProps) {
  const pathname = usePathname();
  const basePath = `/${lng}/tag/${encodeURIComponent(tagName)}`;

  const tabItems = [
    { label: `Scenarios (${modCount})`, value: "modules", path: basePath, exact: true },
    { label: `Topics (${topicCount})`, value: "forum", path: `${basePath}/forum` },
  ];

  const isActive = (tab: { path: string; exact?: boolean }) => {
    if (tab.exact) {
      return pathname === tab.path;
    }
    return pathname?.startsWith(tab.path);
  };

  return (
    <div className="border-b">
      <div className="flex">
        {tabItems.map((tab) => (
          <LinkWithLng
            key={tab.value}
            href={tab.path}
            className={cn(
              "border-b-2 border-transparent px-4 py-3 text-sm text-muted-foreground transition-all hover:border-foreground hover:text-foreground",
              isActive(tab) && "border-foreground text-foreground font-medium"
            )}
          >
            {tab.label}
          </LinkWithLng>
        ))}
      </div>
    </div>
  );
}
