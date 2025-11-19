"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "@/lib/i18n/react";

interface SearchTabsProps {
  lng: string;
  counts: {
    scenarios: number;
    tags: number;
    topics: number;
    users: number;
  };
}

export function SearchTabs({ lng, counts }: SearchTabsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const { t } = useTranslation();

  const tabs = [
    {
      value: "all",
      label: t("search_tab_all"),
      href: `/${lng}/search?keyword=${keyword}`,
    },
    {
      value: "scenario",
      label: `${t("search_tab_scenario")}(${counts.scenarios})`,
      href: `/${lng}/search/scenario?keyword=${keyword}`,
    },
    {
      value: "tag",
      label: `${t("search_tab_tag")}(${counts.tags})`,
      href: `/${lng}/search/tag?keyword=${keyword}`,
    },
    {
      value: "topic",
      label: `${t("search_tab_topic")}(${counts.topics})`,
      href: `/${lng}/search/topic?keyword=${keyword}`,
    },
    {
      value: "user",
      label: `${t("search_tab_user")}(${counts.users})`,
      href: `/${lng}/search/user?keyword=${keyword}`,
    },
  ];

  const getCurrentValue = () => {
    if (pathname.endsWith("/scenario")) return "scenario";
    if (pathname.endsWith("/tag")) return "tag";
    if (pathname.endsWith("/topic")) return "topic";
    if (pathname.endsWith("/user")) return "user";
    return "all";
  };

  return (
    <Tabs value={getCurrentValue()} className="w-full">
      <TabsList className="w-full justify-start">
        {tabs.map((tab) => (
          <Link key={tab.value} href={tab.href}>
            <TabsTrigger value={tab.value}>{tab.label}</TabsTrigger>
          </Link>
        ))}
      </TabsList>
    </Tabs>
  );
}

