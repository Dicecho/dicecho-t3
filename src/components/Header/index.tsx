import clsx from "clsx";
import { type ComponentProps } from "react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AuthDialog } from "@/components/Auth/AuthDialog";
import { getServerAuthSession } from "@/server/auth";
import { getTranslation } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { setThemeCookie } from "@/lib/theme/actions";

export type HeaderProps = ComponentProps<"div"> & {
  lng: string;
  theme: string;
};

export const Header = async ({ lng, theme, ...props }: HeaderProps) => {
  const authSession = await getServerAuthSession();
  const { t } = await getTranslation(lng);

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
        "bg-background/60 sticky left-0 right-0 top-0 z-10 shadow-xl max-md:hidden",
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
                    <NavigationMenuLink
                      href={`/${lng}${menu.link}`}
                      className={clsx(
                        navigationMenuTriggerStyle(),
                        "capitalize",
                      )}
                    >
                      <BookOpenText size={16} />
                      {menu.title}
                    </NavigationMenuLink>
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
            <ThemeChanger theme={theme} setTheme={setThemeCookie} />
            {authSession ? (
              <Popover>
                <PopoverTrigger>
                  <UserAvatar
                    user={authSession.user}
                    alt="avatar"
                    width={40}
                    height={40}
                    className="h-10 w-10 cursor-pointer rounded-full border object-cover"
                  />
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
