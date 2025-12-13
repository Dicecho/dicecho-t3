"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n/react";
import type { IUserDto } from "@dicecho/types";
import { useAccount } from "@/hooks/useAccount";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AccountTabsProps {
  user: IUserDto;
  lng: string;
  userId: string;
}

export const AccountTabs = ({ user, lng, userId }: AccountTabsProps) => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const { account, isAuthenticated } = useAccount();
  const isSelf = isAuthenticated && account._id === user._id;

  const basePath = `/${lng}/account/${userId}`;

  // Determine active tab from pathname
  const getActiveTab = () => {
    if (pathname === basePath) return "home";
    if (pathname?.startsWith(`${basePath}/rate`)) return "rate";
    if (pathname?.startsWith(`${basePath}/topic`)) return "topic";
    if (pathname?.startsWith(`${basePath}/collection`)) return "collection";
    if (pathname?.startsWith(`${basePath}/followers`)) return "followers";
    if (pathname?.startsWith(`${basePath}/followings`)) return "followings";
    if (pathname?.startsWith(`${basePath}/setting`)) return "setting";
    return "home";
  };

  const handleTabChange = (value: string) => {
    const routes: Record<string, string> = {
      home: basePath,
      rate: `${basePath}/rate`,
      topic: `${basePath}/topic`,
      collection: `${basePath}/collection`,
      followers: `${basePath}/followers`,
      followings: `${basePath}/followings`,
      setting: `${basePath}/setting`,
    };
    const route = routes[value];
    if (route) {
      router.push(route);
    }
  };

  const tabItems = [
    {
      label: t("home"),
      value: "home",
      },
    {
      label: t("topics"),
      value: "topic",
    },
    {
      label: t("collection"),
      value: "collection",
    },
    {
      label: t("followers"),
      value: "followers",
    },
    {
      label: t("following"),
      value: "followings",
    },
    {
      label: t("settings"),
      value: "setting",
    },
  ].filter((tab) => isSelf || tab.value !== "setting");

  return (
    <div className="sticky top-0 md:top-16 z-10 border-b border-border/60 bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/70">
      <div className="container">
        <Tabs value={getActiveTab()} onValueChange={handleTabChange}>
          <TabsList className="flex h-12 w-full justify-start gap-2 overflow-x-auto rounded-none border-0 bg-transparent p-0">
            {tabItems.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="rounded-none h-full border-b-2 border-transparent px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};
