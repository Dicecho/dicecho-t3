import clsx from "clsx";
import type { ComponentProps, FC } from "react";
// import { useTranslation } from "next-i18next";
import { BookOpenText, MessageCircleMore, Videotape } from "lucide-react";
import Link from "next/link";
import Img from "next/image";
import logo from "./logo.png";
// import { ThemeChanger } from "@/components/theme/ThemeChanger";
// import { LanguageChanger } from "@/components/i18n/LanguageChanger";
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

export type HeaderProps = ComponentProps<"div">;
export const Header: FC<HeaderProps> = async (props) => {
  const session = await getServerAuthSession();
  // const [t] = useTranslation(["common"]);

  return (
    <div
      {...props}
      className={clsx("bg-base-200 sticky left-0 right-0 top-0 z-10 shadow-xl")}
    >
      <div className="container mx-auto">
        <div className="flex min-h-16 items-center">
          <div className="w-1/2 justify-start">
            <Link href="/" passHref>
              <Img src={logo.src} alt="diceho logo" width={32} height={32} />
            </Link>
          </div>

          <div className="hidden shrink-0 md:flex">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/scenario" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={clsx(
                        navigationMenuTriggerStyle(),
                        "capitalize",
                      )}
                    >
                      <BookOpenText size={16} />
                      scenario
                      {/* {t("scenario")} */}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/forum" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={clsx(
                        navigationMenuTriggerStyle(),
                        "capitalize",
                      )}
                    >
                      <MessageCircleMore size={16} />
                      forum
                      {/* {t("forum")} */}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/replay" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={clsx(
                        navigationMenuTriggerStyle(),
                        "capitalize",
                      )}
                    >
                      <Videotape size={16} />
                      replay
                      {/* {t("replay")} */}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* 
        <div className="navbar-center">
        </div> */}
          <div className="flex w-1/2 items-center justify-end gap-4 capitalize">
            {/* <LanguageChanger />
            <ThemeChanger /> */}
            {session ? (
              <Popover>
                <PopoverTrigger>
                  <Avatar className="hover:shadow-lg transition-all">
                    <AvatarImage className="object-cover" src={session.user.avatarUrl} />
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
