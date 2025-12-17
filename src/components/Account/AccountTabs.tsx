"use client";

import { usePathname } from "next/navigation";
import { useTranslation } from "@/lib/i18n/react";
import type { IUserDto } from "@dicecho/types";
import { useAccount } from "@/hooks/useAccount";
import { LinkWithLng } from "@/components/Link/LinkWithLng";
import { cn } from "@/lib/utils";

interface AccountTabsProps {
  user: IUserDto;
  lng: string;
}

export const AccountTabs = ({ user, lng }: AccountTabsProps) => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const { account, isAuthenticated } = useAccount();
  const isSelf = isAuthenticated && account._id === user._id;

  const basePath = `/${lng}/account/${user._id}`;

  const tabItems = [
    { label: t("home"), value: "home", path: basePath, exact: true },
    { label: t("topics"), value: "topic", path: `${basePath}/topic` },
    { label: t("collection"), value: "collection", path: `${basePath}/collection` },
    ...(isSelf ? [{ label: t("settings"), value: "setting", path: `${basePath}/setting` }] : []),
  ];

  const isActive = (tab: { path: string; exact?: boolean }) => {
    if (tab.exact) {
      return pathname === tab.path;
    }
    return pathname?.startsWith(tab.path);
  };

  // 只在移动端显示，桌面端 Tab 在 AccountHeader 内
  return (
    <div className="sticky top-14 z-10 flex justify-center bg-card/80 backdrop-blur supports-backdrop-filter:bg-card/70 shadow-md md:hidden">
      <div className="container flex justify-center">
        {tabItems.map((tab) => (
          <LinkWithLng
            key={tab.value}
            href={tab.path}
            className={cn(
              "mx-2 border-b-2 border-transparent px-2 py-4 text-sm text-muted-foreground transition-all hover:border-foreground hover:text-foreground",
              isActive(tab) && "border-foreground text-foreground"
            )}
          >
            {tab.label}
          </LinkWithLng>
        ))}
      </div>
    </div>
  );
};
