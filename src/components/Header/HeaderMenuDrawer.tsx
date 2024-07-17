"use client";
import type { FC, PropsWithChildren } from "react";
import {
  UserPlus,
  ChevronRight,
  Bell,
  Star,
  Settings,
  LogOut,
} from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { signOut } from "next-auth/react";
import { useAccount } from "@/hooks/useAccount";
import { UserAvatar } from "@/components/User/Avatar";
import { useTranslation } from "@/lib/i18n/react";
import { LinkWithLng } from "../Link";

export const HeaderMenuDrawer: FC<PropsWithChildren> = ({ children }) => {
  const { isAuthenticated, account } = useAccount();
  const { t } = useTranslation();

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

  return (
    <Drawer direction="left">
      <DrawerTrigger>{children}</DrawerTrigger>
      <DrawerContent className="h-full w-60 rounded-none p-6">
        <LinkWithLng
          href={isAuthenticated ? `/account/${account._id}` : "/account"}
        >
          <DrawerHeader className="mb-4 flex gap-4 border-b border-solid border-border p-0 pb-4">
            {isAuthenticated ? (
              <UserAvatar
                className="h-10 w-10 rounded-full object-cover"
                width={40}
                height={40}
                user={account}
                alt="user account"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                <UserPlus size={16} className="text-secondary-foreground" />
              </div>
            )}
            <div className="text-start">
              <DrawerTitle className="text-base font-normal">
                {isAuthenticated ? account.nickName : t("not_sign_in")}
              </DrawerTitle>
              <DrawerDescription className="flex items-center text-sm text-muted-foreground">
                {t("profile_and_account")} <ChevronRight size={16} />
              </DrawerDescription>
            </div>
          </DrawerHeader>
        </LinkWithLng>

        <div className="flex flex-col gap-2">
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
              className="flex items-center gap-2 p-2 text-destructive"
              onClick={() => signOut()}
            >
              <LogOut size={16} />
              {t("sign_out")}
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
