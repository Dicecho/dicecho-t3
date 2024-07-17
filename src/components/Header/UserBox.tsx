"use client";
import React from "react";
import type { ComponentProps, PropsWithChildren } from "react";
import { User, Bell, Star, Settings, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import clsx from "clsx";
import { useTranslation } from "@/lib/i18n/react";
import { useParams } from "next/navigation";
import { LinkWithLng } from "../Link";

interface UserBoxProps {
  user: { id: string; nickName: string };
}

const UserBoxItem: React.FC<PropsWithChildren<ComponentProps<"div">>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={clsx(
        "flex cursor-pointer items-center gap-4 rounded-md px-4 py-2 transition-all hover:bg-slate-200 ",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const UserBox: React.FC<UserBoxProps> = ({ user }) => {
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation(lng);

  const menus = [
    {
      icon: User,
      label: t("profile"),
      link: `/account/${user.id}`,
    },
    {
      icon: Bell,
      label: t("notification"),
      link: `/account/notification`,
    },
    {
      icon: Star,
      label: t("collection"),
      link: `/account/${user.id}/collection`,
    },
    {
      icon: Settings,
      label: t("settings"),
      link: `/settings`,
    },
  ];

  return (
    <div className="flex flex-col gap-2">
      <div className="border-b border-slate-100 py-4 text-center text-muted-foreground">
        {user.nickName}
      </div>

      {menus.map((menu) => (
        <LinkWithLng href={menu.link} key={menu.link}>
          <UserBoxItem>
            <menu.icon size={16} />
            {menu.label}
          </UserBoxItem>
        </LinkWithLng>
      ))}

      <UserBoxItem className="hover:text-destructive" onClick={() => signOut()}>
        <LogOut size={16} />
        {t("sign_out")}
      </UserBoxItem>
    </div>
  );
};
