"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "@/lib/i18n/react";
import { cn } from "@/lib/utils";

type SettingsMenuItemProps = {
  href: string;
  label: string;
  description?: string;
};

function SettingsMenuItem({ href, label, description }: SettingsMenuItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center justify-between py-4 px-4",
        "border-b border-border last:border-b-0",
        "hover:bg-muted/50 transition-colors"
      )}
    >
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium">{label}</span>
        {description && (
          <span className="text-xs text-muted-foreground">{description}</span>
        )}
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </Link>
  );
}

type SettingsMenuProps = {
  userId: string;
  lng: string;
};

export function SettingsMenu({ userId, lng }: SettingsMenuProps) {
  const { t } = useTranslation();

  const menuItems = [
    {
      href: `/${lng}/account/${userId}/setting/profile`,
      label: t("settings_menu_profile"),
    },
    {
      href: `/${lng}/account/${userId}/setting/avatar`,
      label: t("settings_menu_avatar"),
    },
    {
      href: `/${lng}/account/${userId}/setting/password`,
      label: t("settings_menu_password"),
    },
    {
      href: `/${lng}/account/${userId}/setting/block`,
      label: t("settings_menu_block"),
    },
  ];

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      {menuItems.map((item) => (
        <SettingsMenuItem
          key={item.href}
          href={item.href}
          label={item.label}
        />
      ))}
    </div>
  );
}
