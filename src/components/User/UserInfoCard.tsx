"use client";

import type { FC, ReactNode } from "react";
import type { IUserDto } from "@dicecho/types";
import { UserAvatar } from "./Avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { LinkWithLng } from "@/components/Link/LinkWithLng";
import { cn } from "@/lib/utils";

type UserInfoCardProps = {
  user: IUserDto;
  actions?: ReactNode;
  className?: string;
};

/**
 * UserInfoCard - 用户信息卡片组件
 *
 * 显示用户的基本信息和社交数据
 * - 头像(带装饰框)
 * - 昵称和个性签名
 * - 粉丝/关注/获赞数
 * - 关注/取关按钮(非本人)
 */
export const UserInfoCard: FC<UserInfoCardProps> = ({
  user,
  actions,
  className,
}) => {
  return (
    <div className={cn("w-80 overflow-hidden", className)}>
      {/* 背景图 */}
      <div
        className="h-20 bg-cover bg-center"
        style={{
          backgroundImage: user.backgroundUrl
            ? `url(${user.backgroundUrl})`
            : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      />

      {/* 卡片内容 */}
      <div className="p-4">
        {/* 用户信息区 */}
        <div className="flex items-start gap-3">
          <UserAvatar
            user={user}
            className="border-background h-12 w-12 border-2"
          />

          <div className="min-w-0 flex-1">
            <LinkWithLng href={`/account/${user._id}`}>
              <span className="text-foreground block truncate font-semibold hover:underline">
                {user.nickName}
              </span>
            </LinkWithLng>
            {user.note && (
              <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                {user.note}
              </p>
            )}
          </div>
        </div>

        {/* 统计数据区 */}
        <div className="mt-4 flex items-center justify-around text-center text-sm">
          <LinkWithLng href={`/account/${user._id}/followers`}>
            <div className="font-semibold">{user.followerCount ?? 0}</div>
            <div className="text-muted-foreground">粉丝</div>
          </LinkWithLng>

          <Separator orientation="vertical" className="h-8" />

          <LinkWithLng href={`/account/${user._id}/followings`}>
            <div className="font-semibold">{user.followingCount ?? 0}</div>
            <div className="text-muted-foreground">关注</div>
          </LinkWithLng>

          <Separator orientation="vertical" className="h-8" />

          <div>
            <div className="font-semibold">{user.likedCount ?? 0}</div>
            <div className="text-muted-foreground">获赞</div>
          </div>
        </div>

        {actions && <div className="mt-4">{actions}</div>}
      </div>
    </div>
  );
};

/**
 * UserInfoCardSkeleton - 加载状态骨架屏
 */
export const UserInfoCardSkeleton: FC<{ className?: string }> = ({
  className,
}) => {
  return (
    <div
      className={cn(
        "bg-card w-80 overflow-hidden rounded-lg border",
        className,
      )}
    >
      <Skeleton className="h-20 rounded-none" />
      <div className="p-4">
        <div className="flex items-start gap-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
        <div className="mt-4 flex justify-around">
          <Skeleton className="h-12 w-16" />
          <Skeleton className="h-12 w-16" />
          <Skeleton className="h-12 w-16" />
        </div>
        <Skeleton className="mt-4 h-9 w-full" />
      </div>
    </div>
  );
};
