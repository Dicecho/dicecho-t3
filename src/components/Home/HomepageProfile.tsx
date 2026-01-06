"use client";
import Link from "next/link";
import { FC } from "react";
import { Separator } from "@/components/ui/separator";
import type { IUserDto } from "@dicecho/types";
import { UserAvatar } from "../User/Avatar";

interface HomepageProfileProps {
  user: IUserDto;
  lng: string;
}

export const HomepageProfile: FC<HomepageProfileProps> = ({ user, lng }) => {
  return (
    <div className="flex flex-col items-center">
      <div>
        <UserAvatar user={user} className="h-16 w-16" />
      </div>

      <div className="mt-4 mb-2 text-center text-lg font-semibold">
        {user.nickName}
      </div>

      {user.note && (
        <div className="text-muted-foreground mb-4 text-center text-sm">
          {user.note}
        </div>
      )}

      <div className="flex items-center gap-4 text-sm">
        <Link
          href={`/${lng}/account/${user._id}/followers`}
          className="hover:text-primary flex flex-col items-center transition-colors"
        >
          <span className="text-lg font-semibold">{user.followerCount}</span>
          <span className="text-muted-foreground">粉丝</span>
        </Link>

        <Separator orientation="vertical" className="h-8" />

        <Link
          href={`/${lng}/account/${user._id}/followings`}
          className="hover:text-primary flex flex-col items-center transition-colors"
        >
          <span className="text-lg font-semibold">{user.followingCount}</span>
          <span className="text-muted-foreground">关注</span>
        </Link>

        <Separator orientation="vertical" className="h-8" />

        <div className="flex flex-col items-center">
          <span className="text-lg font-semibold">{user.likedCount}</span>
          <span className="text-muted-foreground">获赞</span>
        </div>
      </div>
    </div>
  );
};
