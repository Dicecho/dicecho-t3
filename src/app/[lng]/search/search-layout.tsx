"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "@/lib/i18n/react";
import { useDicecho } from "@/hooks/useDicecho";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useSearchParams } from "next/navigation";
import { LinkWithLng } from "@/components/Link";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function SearchLayout({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const { t } = useTranslation();
  const { api } = useDicecho();
  const pathname = usePathname();

  // Fetch counts for tabs - will reuse cache if already fetched by SearchLayoutWithContent
  const { data: scenariosCount } = useQuery({
    queryKey: ["search", "scenarios", "count", keyword],
    queryFn: () => api.module.list({ keyword, pageSize: 1 }),
    enabled: !!keyword,
  });

  const { data: tagsCount } = useQuery({
    queryKey: ["search", "tags", "count", keyword],
    queryFn: () => api.search.tag({ keyword, pageSize: 1 }),
    enabled: !!keyword,
  });

  const { data: topicsCount } = useQuery({
    queryKey: ["search", "topics", "count", keyword],
    queryFn: () => api.search.topic({ keyword, pageSize: 1 }),
    enabled: !!keyword,
  });

  const { data: usersCount } = useQuery({
    queryKey: ["search", "users", "count", keyword],
    queryFn: () => api.search.user({ keyword, pageSize: 1 }),
    enabled: !!keyword,
  });

  const getCurrentValue = () => {
    if (pathname.endsWith("/scenario")) return "scenario";
    if (pathname.endsWith("/tag")) return "tag";
    if (pathname.endsWith("/topic")) return "topic";
    if (pathname.endsWith("/user")) return "user";
    return "all";
  };

  const tabs = [
    {
      value: "all",
      label: t("search_tab_all"),
      href: `/search?keyword=${keyword}`,
    },
    {
      value: "scenario",
      label: `${t("search_tab_scenario")}`,
      href: `/search/scenario?keyword=${keyword}`,
      count: scenariosCount ? (
        <Badge variant="accent"> {scenariosCount.totalCount} </Badge>
      ) : (
        <Loader2 className="h-4 w-4 animate-spin" />
      ),
    },
    {
      value: "tag",
      label: `${t("search_tab_tag")}`,
      href: `/search/tag?keyword=${keyword}`,
      count: tagsCount ? (
        <Badge variant="accent"> {tagsCount.totalCount} </Badge>
      ) : (
        <Loader2 className="h-4 w-4 animate-spin" />
      ),
    },
    {
      value: "topic",
      label: `${t("search_tab_topic")}`,
      href: `/search/topic?keyword=${keyword}`,
      count: topicsCount ? (
        <Badge variant="accent"> {topicsCount.totalCount} </Badge>
      ) : (
        <Loader2 className="h-4 w-4 animate-spin" />
      ),
    },
    {
      value: "user",
      label: `${t("search_tab_user")}`,
      href: `/search/user?keyword=${keyword}`,
      count: usersCount ? (
        <Badge variant="accent"> {usersCount.totalCount} </Badge>
      ) : (
        <Loader2 className="h-4 w-4 animate-spin" />
      ),
    },
  ];

  return (
    <div className="container py-8 overflow-x-hidden">
      <div className="mb-6">
        <h1 className="mb-4 text-2xl font-bold">
          {t("search_result_for")}: &quot;{keyword}&quot;
        </h1>
        <Tabs value={getCurrentValue()} className="w-full">
          <TabsList className="w-full justify-start">
            {tabs.map((tab) => (
              <LinkWithLng key={tab.value} href={tab.href}>
                <TabsTrigger
                  className="flex items-center gap-1"
                  value={tab.value}
                >
                  {tab.label} {tab.count}
                </TabsTrigger>
              </LinkWithLng>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {children}
    </div>
  );
}
