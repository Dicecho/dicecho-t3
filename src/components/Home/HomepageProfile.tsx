"use client";
import Link from "next/link";
import { FC } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import type { IUserDto } from "@dicecho/types";

interface HomepageProfileProps {
  user: IUserDto;
  lng: string;
}

export const HomepageProfile: FC<HomepageProfileProps> = ({ user, lng }) => {
  return (
    <div className="flex flex-col items-center">
      <Avatar className="h-16 w-16 mb-4">
        <AvatarImage src={user.avatarUrl} alt={user.nickName} />
        <AvatarFallback>{user.nickName.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>

      <div className="text-lg font-semibold mb-2 text-center">{user.nickName}</div>

      {user.note && (
        <div className="text-sm text-muted-foreground mb-4 text-center">
          {user.note}
        </div>
      )}

      <div className="flex items-center gap-4 text-sm">
        <Link
          href={`/${lng}/account/${user._id}/followers`}
          className="flex flex-col items-center hover:text-primary transition-colors"
        >
          <span className="font-semibold text-lg">{user.followerCount}</span>
          <span className="text-muted-foreground">粉丝</span>
        </Link>

        <Separator orientation="vertical" className="h-8" />

        <Link
          href={`/${lng}/account/${user._id}/followings`}
          className="flex flex-col items-center hover:text-primary transition-colors"
        >
          <span className="font-semibold text-lg">{user.followingCount}</span>
          <span className="text-muted-foreground">关注</span>
        </Link>

        <Separator orientation="vertical" className="h-8" />

        <div className="flex flex-col items-center">
          <span className="font-semibold text-lg">{user.likedCount}</span>
          <span className="text-muted-foreground">获赞</span>
        </div>
      </div>
    </div>
  );
};

