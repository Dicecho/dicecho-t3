"use client";
import React from "react";
import type { ComponentProps, PropsWithChildren } from "react";
import Link from "next/link";
import { User, Bell, Star, Settings, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import clsx from "clsx";
import { useTranslation } from "@/lib/i18n/react";
import { useParams } from "next/navigation";

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
  const { lng } = useParams<{ lng: string }>()
  const { t } = useTranslation(lng);

  return (
    <div className="flex flex-col gap-2">
      <div className="border-b border-slate-100 py-4 text-center text-muted-foreground">
        {user.nickName}
      </div>

      <Link href={`/account/${user.id}`}>
        <UserBoxItem>
          <User size={16} />
          {t('profile')}
        </UserBoxItem>
      </Link>

      <Link href={`/account/notification`}>
        <UserBoxItem>
          <Bell size={16} />
          {t('notification')}
        </UserBoxItem>
      </Link>

      <Link href={`/account/${user.id}/collection`} className="custom-link">
        <UserBoxItem>
          <Star size={16} />
          {t('collection')}
        </UserBoxItem>
      </Link>

      <Link href={`/setting`} className="custom-link">
        <UserBoxItem>
          <Settings size={16} />
          {t('settings')}
        </UserBoxItem>
      </Link>

      <UserBoxItem className="hover:text-destructive" onClick={() => signOut()}>
        <LogOut size={16} />
        {t('sign_out')}
      </UserBoxItem>
    </div>
  );
};
