"use client";

import React, { ComponentProps, PropsWithChildren } from "react";
import Link from "next/link";
import { User, Bell, Star, Settings, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import clsx from "clsx";

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
  return (
    <div className="flex flex-col gap-2">
      <div className="border-b border-slate-100 py-4 text-center text-slate-400">
        {user.nickName}
      </div>

      <Link href={`/account/${user.id}`}>
        <UserBoxItem>
          <User size={16} />
          个人中心
        </UserBoxItem>
      </Link>

      <Link href={`/account/notification`}>
        <UserBoxItem>
          <Bell size={16} />
          消息中心
        </UserBoxItem>
      </Link>

      <Link href={`/account/${user.id}/collection`} className="custom-link">
        <UserBoxItem>
          <Star size={16} />
          我的收藏
        </UserBoxItem>
      </Link>

      <Link href={`/setting`} className="custom-link">
        <UserBoxItem>
          <Settings size={16} />
          设置
        </UserBoxItem>
      </Link>

      <UserBoxItem className="hover:text-destructive" onClick={() => signOut()}>
        <LogOut size={16} />
        登出
      </UserBoxItem>
    </div>
  );
};
