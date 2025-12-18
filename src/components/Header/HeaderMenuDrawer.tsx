"use client";
import type { FC, PropsWithChildren } from "react";
import { useEffect, useState, useCallback } from "react";
import {
  UserPlus,
  ChevronRight,
  Bell,
  Star,
  Settings,
  LogOut,
  Sun,
  Moon,
  Languages,
  Palette,
} from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useAccount } from "@/hooks/useAccount";
import { UserAvatar } from "@/components/User/Avatar";
import { useTranslation } from "@/lib/i18n/react";
import { LinkWithLng } from "../Link";
import { useTheme } from "next-themes";
import { useRouter, useParams } from "next/navigation";
import { useThemeTransition } from "@/components/ui/shadcn-io/theme-toggle-button";
import { cloneUserTheme, useUserTheme } from "@/hooks/use-user-theme";
import type { ThemePresetId } from "@/types/theme";
import { usePurePathname } from "@/hooks/usePurePathname";

const LanguageOptions = [
  { key: "en", label: "English" },
  { key: "zh", label: "简体中文" },
  { key: "ja", label: "日本語" },
  { key: "ko", label: "한국어" },
] as const;

export const HeaderMenuDrawer: FC<PropsWithChildren> = ({ children }) => {
  const { isAuthenticated, account } = useAccount();
  const { t } = useTranslation();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { startTransition } = useThemeTransition();
  const {
    theme: userTheme,
    updateTheme,
    presets,
    presetOrder,
  } = useUserTheme();
  const router = useRouter();
  const params = useParams<{ lng: string }>();
  const purePathname = usePurePathname();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const activeMode = mounted ? (resolvedTheme ?? theme) : "light";
  const isDark = activeMode === "dark";
  const themeMode = isDark ? "dark" : "light";

  const handleThemeToggle = useCallback(() => {
    const newMode = isDark ? "light" : "dark";
    startTransition(() => {
      setTheme(newMode);
    });
  }, [isDark, setTheme, startTransition]);

  const handlePresetSelect = (presetId: string) => {
    const preset = presets[presetId as ThemePresetId];
    if (!preset) {
      return;
    }
    updateTheme(() => cloneUserTheme(preset));
  };

  const changeLanguage = (locale: string) => {
    router.push(`/${locale}${purePathname}`);
  };

  const menus = [
    ...(isAuthenticated
      ? [
          {
            icon: Bell,
            label: t("notification"),
            link: `/account/notification`,
          },
          {
            icon: Star,
            label: t("collection"),
            link: `/account/${account._id}/collection`,
          },
        ]
      : []),
    {
      icon: Settings,
      label: t("settings"),
      link: `/settings`,
    },
  ];

  const currentLanguageLabel = LanguageOptions.find(
    (lang) => lang.key === params.lng,
  )?.label;

  const currentPreset = presets[userTheme.id as ThemePresetId];

  return (
    <Drawer direction="left">
      <DrawerTrigger>{children}</DrawerTrigger>
      <DrawerContent className="h-full w-60 rounded-none p-6">
        {/* Dark Mode Toggle Button - Top Right Corner */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4"
          onClick={handleThemeToggle}
        >
          {isDark ? <Moon size={18} /> : <Sun size={18} />}
        </Button>

        <LinkWithLng
          href={isAuthenticated ? `/account/${account._id}` : "/account"}
        >
          <DrawerHeader className="mb-4 flex gap-4 border-b border-solid p-0 pr-10 pb-4">
            {isAuthenticated ? (
              <UserAvatar
                user={{
                  avatarUrl: account.avatarUrl,
                }}
                className="h-10 w-10"
              />
            ) : (
              <div className="bg-secondary flex h-10 w-10 items-center justify-center rounded-full">
                <UserPlus size={16} className="text-secondary-foreground" />
              </div>
            )}
            <div className="text-start">
              <DrawerTitle className="text-base font-normal">
                {isAuthenticated ? account.nickName : t("not_sign_in")}
              </DrawerTitle>
              <DrawerDescription className="text-muted-foreground flex items-center text-sm">
                {t("profile_and_account")} <ChevronRight size={16} />
              </DrawerDescription>
            </div>
          </DrawerHeader>
        </LinkWithLng>

        <div className="flex flex-col gap-2 flex-1">
          {menus.map((menu) => (
            <LinkWithLng href={menu.link} key={menu.link}>
              <div className="flex items-center gap-2 p-2">
                <menu.icon size={16} />
                {menu.label}
              </div>
            </LinkWithLng>
          ))}

          {isAuthenticated && (
            <div
              className="text-destructive flex cursor-pointer items-center gap-2 p-2"
              onClick={() => signOut()}
            >
              <LogOut size={16} />
              {t("sign_out")}
            </div>
          )}

          <div className="mt-auto border-t border-solid py-2" />

          <Select value={params.lng} onValueChange={changeLanguage}>
            <SelectTrigger className="w-full">
              <div className="flex items-center gap-2">
                <Languages size={16} />
                <SelectValue>{currentLanguageLabel}</SelectValue>
              </div>
            </SelectTrigger>
            <SelectContent>
              {LanguageOptions.map((lang) => (
                <SelectItem key={lang.key} value={lang.key}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={userTheme.id} onValueChange={handlePresetSelect}>
            <SelectTrigger className="w-full">
              <div className="flex items-center gap-2">
                <Palette size={16} />
                <SelectValue>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      <div
                        className="border-muted h-3 w-3 rounded-sm border"
                        style={{
                          backgroundColor:
                            currentPreset?.tokens[themeMode].primary,
                        }}
                      />
                      <div
                        className="border-muted h-3 w-3 rounded-sm border"
                        style={{
                          backgroundColor:
                            currentPreset?.tokens[themeMode].accent,
                        }}
                      />
                      <div
                        className="border-muted h-3 w-3 rounded-sm border"
                        style={{
                          backgroundColor:
                            currentPreset?.tokens[themeMode].secondary,
                        }}
                      />
                    </div>
                    <span>{currentPreset?.name}</span>
                  </div>
                </SelectValue>
              </div>
            </SelectTrigger>
            <SelectContent>
              {presetOrder.map((presetId) => {
                const preset = presets[presetId];
                if (!preset) return null;
                return (
                  <SelectItem key={presetId} value={presetId}>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5">
                        <div
                          className="border-muted h-3 w-3 rounded-sm border"
                          style={{
                            backgroundColor: preset.tokens[themeMode].primary,
                          }}
                        />
                        <div
                          className="border-muted h-3 w-3 rounded-sm border"
                          style={{
                            backgroundColor: preset.tokens[themeMode].accent,
                          }}
                        />
                        <div
                          className="border-muted h-3 w-3 rounded-sm border"
                          style={{
                            backgroundColor: preset.tokens[themeMode].secondary,
                          }}
                        />
                      </div>
                      <span>{preset.name}</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

        </div>
      </DrawerContent>
    </Drawer>
  );
};
