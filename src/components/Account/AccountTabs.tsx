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
    if (pathname?.startsWith(`${basePath}/mark`)) return "mark";
    if (pathname?.startsWith(`${basePath}/topic`)) return "topic";
    if (pathname?.startsWith(`${basePath}/collection`)) return "collection";
    if (pathname?.startsWith(`${basePath}/setting`)) return "setting";
    return "home";
  };

  const handleTabChange = (value: string) => {
    const routes: Record<string, string> = {
      home: basePath,
      rate: `${basePath}/rate`,
      mark: `${basePath}/mark`,
      topic: `${basePath}/topic`,
      collection: `${basePath}/collection`,
      setting: `${basePath}/setting`,
    };
    const route = routes[value];
    if (route) {
      router.push(route);
    }
  };

  return (
    <div className="container mx-auto">
    <Tabs value={getActiveTab()} onValueChange={handleTabChange}>
      <TabsList>
        <TabsTrigger value="home">{t("home")}</TabsTrigger>
        <TabsTrigger value="rate">{t("Rate.type_rate")}</TabsTrigger>
        <TabsTrigger value="topic">{t("topics")}</TabsTrigger>
        <TabsTrigger value="collection">{t("collection")}</TabsTrigger>
        {isSelf && <TabsTrigger value="setting">{t("settings")}</TabsTrigger>}
      </TabsList>
    </Tabs>
    </div>
  );
};
