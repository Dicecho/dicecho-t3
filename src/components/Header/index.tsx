import clsx from "clsx";
import { type ComponentProps, type FC } from "react";
import { BookOpenText } from "lucide-react";
import Link from "next/link";
import DicechoLogo from "./dicecho.svg";
import { ThemeChanger } from "./ThemeChanger";
import { LanguageChanger } from "./LanguageChanger";
import { UserBox } from "./UserBox";
import { UserAvatar } from "@/components/User/Avatar";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { AuthDialog } from "@/components/Auth/AuthDialog";
import { getServerAuthSession } from "@/server/auth";
import { useTranslation } from "@/lib/i18n";

export type HeaderProps = ComponentProps<"div"> & {
  lng: string;
  theme: string;
};

export const Header: FC<HeaderProps> = async ({ lng, theme, ...props }) => {
  const session = await getServerAuthSession();
  const { t } = await useTranslation(lng);

  const menus = [
    {
      title: t("scenario"),
      link: "/scenario",
    },
    {
      title: t("forum"),
      link: "/forum",
    },
    {
      title: t("replay"),
      link: "/replay",
    },
  ];

  return (
    <div
      {...props}
      className={clsx(
        "sticky left-0 right-0 top-0 z-10 bg-base-200 shadow-xl max-md:hidden",
      )}
    >
      <div className="container mx-auto">
        <div className="flex min-h-16 items-center">
          <div className="w-1/2 justify-start">
            <Link href={`/${lng}`} passHref>
              <DicechoLogo
                className="w-8 text-[#9396f7]"
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
                    <Link href={`/${lng}${menu.link}`} legacyBehavior passHref>
                      <NavigationMenuLink
                        className={clsx(
                          navigationMenuTriggerStyle(),
                          "capitalize",
                        )}
                      >
                        <BookOpenText size={16} />
                        {menu.title}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* 
        <div className="navbar-center">
        </div> */}
          <div className="flex w-1/2 items-center justify-end gap-2 capitalize">
            <LanguageChanger />
            <ThemeChanger initialTheme={theme} />
            {session ? (
              <Popover>
                <PopoverTrigger>
                    <UserAvatar
                      user={session.user}
                      alt="avatar"
                      width={40}
                      height={40}
                      className="object-cover w-10 h-10 rounded-full border cursor-pointer"
                    />
                </PopoverTrigger>
                <PopoverContent align="end">
                  <UserBox
                    user={{
                      id: session.user._id,
                      nickName: session.user.nickName,
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
