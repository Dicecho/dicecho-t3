import { type ComponentProps } from "react";
import Link from "next/link";
import DicechoLogo from "./dicecho.svg";
import { LanguageChanger } from "./LanguageChanger";
import { ThemeSwitcher } from "@/components/theme-switcher";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { getTranslation } from "@/lib/i18n";
import { ColorModeSwitcher } from "../color-mode-switcher";
import { SearchInput } from "@/components/Search/SearchInput";
import { HeaderAccount } from "./header-account";
import { cn } from "@/lib/utils";

export type HeaderProps = ComponentProps<"div"> & {
  lng: string;
};

export const Header = async ({ lng, ...props }: HeaderProps) => {
  const { t } = await getTranslation(lng);

  const menus = [
    {
      title: t("scenario"),
      link: "/scenario",
    },
    // {
    //   title: t("forum"),
    //   link: "/forum",
    // },
    // {
    //   title: t("replay"),
    //   link: "/replay",
    // },
  ];

  return (
    <div
      {...props}
      className={cn(
        "bg-header sticky top-0 right-0 left-0 z-10 shadow-xl max-md:hidden",
      )}
    >
      <div className="container">
        <div className="flex min-h-16 items-center gap-4">
          <div className="flex shrink-0 items-center">
            <Link href={`/${lng}`} passHref>
              <DicechoLogo
                className="text-primary w-8"
                width={32}
                height={32}
              />
            </Link>
          </div>

          <div className="hidden shrink-0 md:flex">
            <NavigationMenu>
              <NavigationMenuList>
                {menus.map((menu) => (
                  <NavigationMenuItem key={menu.link}>
                    <Link
                      href={`/${lng}${menu.link}`}
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "capitalize",
                      )}
                    >
                      {menu.title}
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="hidden flex-1 md:flex">
            <SearchInput placeholder={t("search_placeholder")} className="max-w-md" />
          </div>

          <div className="ml-auto flex items-center gap-2 capitalize">
            <LanguageChanger />
            <ColorModeSwitcher />
            <ThemeSwitcher />
            <HeaderAccount />
          </div>
        </div>
      </div>
    </div>
  );
};
