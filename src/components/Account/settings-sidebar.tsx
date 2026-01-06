"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/lib/i18n/react";
import { cn } from "@/lib/utils";

type SettingsSidebarProps = {
  userId: string;
  lng: string;
};

export function SettingsSidebar({ userId, lng }: SettingsSidebarProps) {
  const { t } = useTranslation();
  const pathname = usePathname();

  const baseUrl = `/${lng}/account/${userId}/setting`;

  const menuItems = [
    { href: baseUrl, label: t("settings_menu_profile"), exact: true },
    { href: `${baseUrl}/avatar`, label: t("settings_menu_avatar") },
    { href: `${baseUrl}/password`, label: t("settings_menu_password") },
    { href: `${baseUrl}/block`, label: t("settings_menu_block") },
  ];

  const isActive = (href: string, exact?: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b">
        <CardTitle className="text-base">{t("settings_title")}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center justify-between px-4 py-3 text-sm transition-colors",
              "border-b last:border-b-0",
              isActive(item.href, item.exact)
                ? "bg-primary/5 text-primary"
                : "hover:bg-muted/50"
            )}
          >
            {item.label}
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
