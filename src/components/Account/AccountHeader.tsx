"use client";

import { UserAvatar } from "@/components/User/Avatar";
import { Button } from "@/components/ui/button";
import { LinkWithLng } from "@/components/Link/LinkWithLng";
import { useAccount } from "@/hooks/useAccount";
import { useDicecho } from "@/hooks/useDicecho";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "@/lib/i18n/react";
import { usePathname } from "next/navigation";
import type { IUserDto } from "@dicecho/types";
import { UserPlus, UserX } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { AccountDetailHeader } from "./account-detail-header";

interface AccountHeaderProps {
  user: IUserDto;
  lng: string;
  showTabs?: boolean;
}

// 统计数据组件
const UserStats = ({
  user,
  className,
}: {
  user: IUserDto;
  className?: string;
}) => {
  const { t, i18n } = useTranslation();

  const stats = [
    {
      label: t("followers"),
      value: user.followerCount,
      href: `/${i18n.language}/account/${user._id}/followers`,
    },
    {
      label: t("following"),
      value: user.followingCount,
      href: `/${i18n.language}/account/${user._id}/followings`,
    },
    {
      label: t("liked"),
      value: user.likedCount,
    },
  ];

  return (
    <div className={className}>
      {stats.map((stat) => (
        <div key={stat.label} className="flex items-center">
          {stat.href ? (
            <LinkWithLng
              href={stat.href}
              className="text-foreground hover:text-primary flex flex-row gap-2 items-center transition-colors"
            >
              <span className="font-bold">{stat.value}</span>
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </LinkWithLng>
          ) : (
            <div className="flex flex-row items-center gap-2">
              <span className="font-bold">{stat.value}</span>
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// 操作按钮组件
const UserActions = ({
  user,
  lng,
  isSelf,
  className,
  size = "default",
}: {
  user: IUserDto;
  lng: string;
  isSelf: boolean;
  className?: string;
  size?: "default" | "sm";
}) => {
  const { t } = useTranslation();
  const { api } = useDicecho();
  const queryClient = useQueryClient();

  const followMutation = useMutation({
    mutationFn: () => api.user.follow(user._id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user", "profile", user._id],
      });
      toast.success(t("follow_success"));
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: () => api.user.unfollow(user._id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user", "profile", user._id],
      });
      toast.success(t("unfollow_success"));
    },
  });

  if (isSelf) {
    return (
      <div className={className}>
        <LinkWithLng
          href={`/${lng}/account/${user._id}/setting`}
          className="flex-1 md:flex-none"
        >
          <Button variant="outline" size={size} className="w-full">
            {t("edit_profile")}
          </Button>
        </LinkWithLng>
      </div>
    );
  }

  return (
    <div className={className}>
      {user.isFollowed ? (
        <Button
          variant="destructive"
          size={size}
          className="flex-1"
          onClick={() => unfollowMutation.mutate()}
          disabled={unfollowMutation.isPending}
        >
          {t("unfollow")}
        </Button>
      ) : (
        <Button
          size={size}
          className="flex-1"
          onClick={() => followMutation.mutate()}
          disabled={followMutation.isPending}
        >
          <UserPlus size={16} className="mr-1" />
          {t("follow")}
        </Button>
      )}
      {/* <Button variant="destructive" size={size} className="ml-2 shrink-0">
        <UserX size={16} />
      </Button> */}
    </div>
  );
};

// Header 内的 Tab 组件
const HeaderTabs = ({
  user,
  lng,
  className,
}: {
  user: IUserDto;
  lng: string;
  className?: string;
}) => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const { account, isAuthenticated } = useAccount();
  const isSelf = isAuthenticated && account._id === user._id;

  const basePath = `/${lng}/account/${user._id}`;

  const tabItems = [
    { label: t("home"), value: "home", path: basePath, exact: true },
    { label: t("topics"), value: "topic", path: `${basePath}/topic` },
    {
      label: t("collection"),
      value: "collection",
      path: `${basePath}/collection`,
    },
    ...(isSelf
      ? [
          {
            label: t("settings"),
            value: "setting",
            path: `${basePath}/setting`,
          },
        ]
      : []),
  ];

  const isActive = (tab: { path: string; exact?: boolean }) => {
    if (tab.exact) {
      return pathname === tab.path;
    }
    return pathname?.startsWith(tab.path);
  };

  return (
    <div className={cn("flex h-8 justify-center", className)}>
      {tabItems.map((tab) => (
        <LinkWithLng
          key={tab.value}
          href={tab.path}
          className={cn(
            "text-muted-foreground hover:border-foreground hover:text-foreground mx-2 border-b-2 border-transparent px-2 pb-1 text-base transition-all",
            isActive(tab) && "border-foreground text-foreground",
          )}
        >
          {tab.label}
        </LinkWithLng>
      ))}
    </div>
  );
};

// 桌面端 Header
const DesktopHeader = ({ user, lng, showTabs }: AccountHeaderProps) => {
  const { account, isAuthenticated } = useAccount();
  const isSelf = isAuthenticated && account._id === user._id;

  return (
    <div className="relative hidden min-h-100 flex-col items-center md:flex">
      {/* 背景图 */}
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: `url(${user.backgroundUrl || ""})` }}
      >
        <div className="to-background absolute inset-0 bg-gradient-to-b from-transparent" />
      </div>

      {/* 头像 */}
      <div className="mt-10 mb-6">
        <UserAvatar user={user} className="h-30 w-30 shadow-md" />
      </div>

      {/* 昵称 */}
      <h1 className="text-foreground mb-2 text-2xl font-bold">
        {user.nickName}
      </h1>

      {/* 简介 */}
      {user.note && (
        <p className="text-muted-foreground mb-2 max-w-2xl text-center">
          {user.note}
        </p>
      )}

      {/* 统计数据 */}
      <UserStats
        user={user}
        className="mb-4 flex gap-4 items-center justify-between"
      />

      {/* 操作按钮 */}
      <UserActions
        user={user}
        lng={lng}
        isSelf={isSelf}
        className="flex items-center"
      />

      {/* 底部间距 */}
      <div className="mt-auto" />

      {/* Tab 栏 */}
      {showTabs && <HeaderTabs user={user} lng={lng} className="my-10" />}
    </div>
  );
};

// 移动端 Header
const MobileHeader = ({ user, lng }: AccountHeaderProps) => {
  const { account, isAuthenticated } = useAccount();
  const isSelf = isAuthenticated && account._id === user._id;

  return (
    <div className="bg-card md:hidden">
      {/* 背景图 */}
      <div
        className="relative h-42 bg-cover bg-center brightness-[0.7]"
        style={{ backgroundImage: `url(${user.backgroundUrl || ""})` }}
      />

      {/* 用户信息区域 */}
      <div className="border-border container border-b pb-4">
        <div className="mb-4 flex">
          {/* 头像 */}
          <div className="-mt-8 mr-6 shrink-0 z-1">
            <UserAvatar
              user={user}
              className="h-20 w-20 shadow-md"
            />
          </div>

          {/* 右侧：统计数据和按钮 */}
          <div className="ml-auto">
            {/* 操作按钮 */}
            <UserActions
              user={user}
              lng={lng}
              isSelf={isSelf}
              className="mt-4 min-w-40 flex items-center"
              size="sm"
            />
          </div>
        </div>

        {/* 昵称 */}
        <h1 className="text-foreground text-lg font-bold">{user.nickName}</h1>

        {/* 简介 */}
        {user.note && (
          <p className="text-muted-foreground mt-2">{user.note}</p>
        )}

        {/* 统计数据 */}
        <UserStats
          user={user}
          className="flex gap-4 mt-2"
        />
      </div>
    </div>
  );
};

export const AccountHeader = ({
  user,
  lng,
  showTabs = true,
}: AccountHeaderProps) => {
  return (
    <>
      <AccountDetailHeader title={user.nickName} />
      <DesktopHeader user={user} lng={lng} showTabs={showTabs} />
      <MobileHeader user={user} lng={lng} />
    </>
  );
};
