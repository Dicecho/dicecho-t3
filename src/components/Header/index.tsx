import clsx from "clsx";
import { type ComponentProps } from "react";
import Link from "next/link";
import DicechoLogo from "./dicecho.svg";
import { LanguageChanger } from "./LanguageChanger";
import { UserBox } from "./UserBox";
import { UserAvatar } from "@/components/User/Avatar";
import { ThemeSwitcher } from "@/components/theme-switcher";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AuthDialog } from "@/components/Auth/AuthDialog";
import { getServerAuthSession } from "@/server/auth";
import { getTranslation } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { ColorModeSwitcher } from "../color-mode-switcher";
import { SearchInput } from "@/components/Search/SearchInput";

export type HeaderProps = ComponentProps<"div"> & {
  lng: string;
};

export const Header = async ({ lng, ...props }: HeaderProps) => {
  const authSession = await getServerAuthSession();
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
      className={clsx(
        "bg-background sticky top-0 right-0 left-0 z-10 shadow-xl max-md:hidden",
      )}
    >
      <div className="container mx-auto">
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
                    <NavigationMenuLink
                      href={`/${lng}${menu.link}`}
                      className={clsx(
                        navigationMenuTriggerStyle(),
                        "capitalize",
                      )}
                    >
                      {menu.title}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="hidden flex-1 md:flex">
            <SearchInput lng={lng} placeholder={t("search_placeholder")} className="max-w-md" />
          </div>

          <div className="ml-auto flex items-center gap-2 capitalize">
            <LanguageChanger />
            <ColorModeSwitcher />
            <ThemeSwitcher />
            {authSession ? (
              <Popover>
                <PopoverTrigger>
                  <Link href={`/${lng}/account/${authSession.user._id}`}>
                    <UserAvatar
                      user={authSession.user}
                      alt="avatar"
                      width={40}
                      height={40}
                      className="h-10 w-10 cursor-pointer rounded-full border object-cover"
                    />
                  </Link>
                </PopoverTrigger>
                <PopoverContent align="end">
                  <UserBox
                    user={{
                      id: authSession.user._id,
                      nickName: authSession.user.nickName,
                    }}
                  />
                </PopoverContent>
              </Popover>
            ) : (
              <AuthDialog>
                <Button className="capitalize" size="sm" color="primary">
                  {t("sign_in")}
                </Button>
              </AuthDialog>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
