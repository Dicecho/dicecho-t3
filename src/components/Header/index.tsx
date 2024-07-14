import clsx from "clsx";
import { type ComponentProps, type FC } from "react";
// import { useTranslation } from "next-i18next";
import { BookOpenText, MessageCircleMore, Videotape } from "lucide-react";
import Link from "next/link";
import Img from "next/image";
import logo from "./logo.png";
// import { ThemeChanger } from "@/components/theme/ThemeChanger";
import { LanguageChanger } from "./LanguageChanger";
import { UserBox } from "./UserBox";
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
};

export const Header: FC<HeaderProps> = async (props) => {
  const session = await getServerAuthSession();
  const { t } = await useTranslation(props.lng);

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
      className={clsx("sticky left-0 right-0 top-0 z-10 bg-base-200 shadow-xl")}
    >
      <div className="container mx-auto">
        <div className="flex min-h-16 items-center">
          <div className="w-1/2 justify-start">
            <Link href={`/${props.lng}`} passHref>
              <Img src={logo.src} alt="diceho logo" width={32} height={32} />
            </Link>
          </div>

          <div className="hidden shrink-0 md:flex">
            <NavigationMenu>
              <NavigationMenuList>
                {menus.map((menu) => (
                  <NavigationMenuItem key={menu.link}>
                    <Link
                      href={`/${props.lng}${menu.link}`}
                      legacyBehavior
                      passHref
                    >
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
          <div className="flex w-1/2 items-center justify-end gap-4 capitalize">
            <LanguageChanger />
            {/* <ThemeChanger /> */}
            {session ? (
              <Popover>
                <PopoverTrigger>
                  <Avatar className="transition-all hover:shadow-lg">
                    <AvatarImage
                      className="object-cover"
                      src={session.user.avatarUrl}
                    />
                    <AvatarFallback>{session.user.nickName}</AvatarFallback>
                  </Avatar>
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
                <Button size="sm" color="primary">
                  sign_in
                  {/* {t("sign_in")} */}
                </Button>
              </AuthDialog>
            )}
          </div>
        </div>
      </div>
      {/* <AccountModal
        open={accountModalOpen}
        dismiss={() => setAccountModalOpen(false)}
      /> */}
    </div>
  );
};
