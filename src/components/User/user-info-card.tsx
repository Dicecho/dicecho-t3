"use client";

import type { FC, ReactNode } from "react";
import type { IUserDto } from "@dicecho/types";
import { useTranslation } from "@/lib/i18n/react";
import { UserAvatar } from "./Avatar";
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
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        "bg-card text-card-foreground relative w-full overflow-hidden rounded-lg border",
        "aspect-[2/1]", // 接近旧版 2:1 的比例
        className,
      )}
    >
      {/* 背景图层（旧版 .cardBg / .cardBgImg 效果） */}
      <div className="bg-muted absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: user.backgroundUrl
              ? `url(${user.backgroundUrl})`
              : "linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)",
          }}
        >
          <div className="via-background/70 to-background absolute inset-0 bg-gradient-to-b from-transparent brightness-75" />
        </div>
      </div>

      {/* 前景内容（旧版 .cardMain） */}
      <div className="relative flex h-full flex-col p-4">
        {/* 用户信息区（旧版 .cardInfo） */}
        <div className="flex items-center gap-3">
          <UserAvatar
            user={user}
            className="border-background h-10 w-10 border-2"
          />

          <div className="min-w-0 flex-1">
            <LinkWithLng href={`/account/${user._id}`}>
              <span className="text-foreground block truncate text-sm font-semibold">
                {user.nickName}
              </span>
            </LinkWithLng>
            {user.note && (
              <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">
                {user.note}
              </p>
            )}
          </div>

          {actions && (
            <div className="ml-auto flex items-center gap-2">{actions}</div>
          )}
        </div>

        {/* 底部数据 + 操作区（旧版 .cardAction/.cardData） */}
        <div className="mt-auto flex items-center pt-3 text-xs">
          <div className="text-foreground flex flex-1 items-center gap-2">
            <LinkWithLng href={`/account/${user._id}/followers`}>
              <div className="hover:text-primary cursor-pointer space-x-2 text-center transition-colors">
                <span className="font-semibold">{user.followerCount ?? 0}</span>
                <span className="text-muted-foreground">{t("followers")}</span>
              </div>
            </LinkWithLng>

            <div className="bg-border h-2 w-px" />

            <LinkWithLng href={`/account/${user._id}/followings`}>
              <div className="hover:text-primary cursor-pointer space-x-2 text-center transition-colors">
                <span className="text-sm font-semibold">
                  {user.followingCount ?? 0}
                </span>
                <span className="text-muted-foreground">{t("following")}</span>
              </div>
            </LinkWithLng>

            <div className="bg-border h-2 w-px" />

            <div className="cursor-default space-x-2 text-center">
              <span className="text-sm font-semibold">
                {user.likedCount ?? 0}
              </span>
              <span className="text-muted-foreground">{t("liked")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const MobileUserInfoCard: FC<UserInfoCardProps> = ({
  user,
  actions,
  className,
}) => {
  const { t } = useTranslation();

  return (
    <div className={cn("bg-background", className)}>
      {/* 顶部背景图区域，对齐老站 AccountDrawer 头部 */}
      <div
        className="h-32 w-full bg-cover bg-center"
        style={{
          backgroundImage: user.backgroundUrl
            ? `url(${user.backgroundUrl})`
            : "linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)",
        }}
      />

      {/* 用户信息与统计、操作区 */}
      <div className="px-4 pb-6">
        <div className="flex items-start gap-4">
          {/* 头像（大号、带边框），靠近老版 Drawer */}
          <div className="-mt-10 shrink-0">
            <div className="relative">
              <div className="bg-background rounded-full p-1">
                <UserAvatar
                  user={user}
                  className="border-background h-20 w-20 border-2"
                />
              </div>
            </div>
          </div>

          {actions && <div className="mt-2 ml-auto flex items-center">{actions}</div>}
        </div>

        {/* 昵称与个性签名，贴合老站 Drawer 下半部分 */}
        <div className="space-y-2">
          <LinkWithLng href={`/account/${user._id}`}>
            <div className="text-foreground mb-2 text-lg font-semibold">
              {user.nickName}
            </div>
          </LinkWithLng>
          {user.note && (
            <div className="text-muted-foreground text-sm">{user.note}</div>
          )}
          <div className="text-foreground items-center space-x-4 text-sm">
            <span className="items-center space-x-2">
              <span className="text-base font-semibold">
                {user.followerCount ?? 0}
              </span>
              <span className="text-muted-foreground text-xs">
                {t("followers")}
              </span>
            </span>

            <span className="bg-border h-2 w-px" />
            <span className="space-x-2 text-center">
              <span className="text-base font-semibold">
                {user.followingCount ?? 0}
              </span>
              <span className="text-muted-foreground text-xs">
                {t("following")}
              </span>
            </span>
            <span className="bg-border h-2 w-px" />
            <span className="space-x-2 text-center">
              <span className="text-base font-semibold">
                {user.likedCount ?? 0}
              </span>
              <span className="text-muted-foreground text-xs">
                {t("liked")}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
