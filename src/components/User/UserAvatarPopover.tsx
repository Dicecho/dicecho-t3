"use client";

import { type ReactNode, type FC, useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  DrawerDescription,
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { UserInfoCard, MobileUserInfoCard } from "./user-info-card";
import {
  UserInfoCardSkeleton,
  MobileUserInfoCardSkeleton,
} from "./user-info-card-skeleton";
import { useTranslation } from "@/lib/i18n/react";
import { useDicecho } from "@/hooks/useDicecho";
import { useIsMobile } from "@/hooks/use-is-mobile";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Loader2 } from "lucide-react";
import { LinkWithLng } from "../Link";

type UserAvatarPopoverProps = {
  userId: string;
  children: ReactNode;
};

/**
 * UserAvatarPopover - 用户头像悬浮/点击弹出组件
 *
 * 桌面: Hover + Click Popover
 * 移动: Click Sheet (bottom drawer)
 * - React Query 自动处理缓存/加载/错误
 * - 懒加载:只在打开时请求
 */
export const UserAvatarPopover: FC<UserAvatarPopoverProps> = ({
  userId,
  children,
}) => {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const isSelf = session?.user?._id === userId;
  const { api } = useDicecho();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  // React Query 自动处理一切
  const {
    data: user,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => api.user.profile(userId),
    enabled: isOpen,
    staleTime: 5 * 60 * 1000,
  });

  // 关注操作
  const followMutation = useMutation({
    mutationFn: () => api.user.follow(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
    },
  });

  // 取关操作
  const unfollowMutation = useMutation({
    mutationFn: () => api.user.unfollow(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
    },
  });

  const isFollowLoading =
    followMutation.isPending || unfollowMutation.isPending || isFetching;
  const isFollowed = user?.isFollowed;

  // 操作按钮 (桌面传递给 UserInfoCard)
  const actions = isSelf ? null : (
    <div className="flex gap-2">
      {isFollowed ? (
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          disabled={isFollowLoading}
          onClick={() => unfollowMutation.mutate()}
        >
          {isFollowLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t("unfollow")}
        </Button>
      ) : (
        <Button
          variant="default"
          size="sm"
          className="flex-1"
          disabled={isFollowLoading}
          onClick={() => followMutation.mutate()}
        >
          {isFollowLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t("follow")}
        </Button>
      )}
    </div>
  );

  const cardContent =
    isLoading || !user ? (
      <UserInfoCardSkeleton className="max-md:w-full" />
    ) : (
      <UserInfoCard user={user} actions={actions} className="max-md:w-full" />
    );

  // // // 移动端: Drawer
  if (isMobile) {
    const mobileContent =
      isLoading || !user ? (
        <MobileUserInfoCardSkeleton />
      ) : (
        <MobileUserInfoCard user={user} actions={actions} />
      );

    return (
      <Drawer onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>{children}</DrawerTrigger>
        <DrawerContent className="h-auto w-full overflow-hidden rounded-t-lg border-0 outline-none">
          <DrawerTitle className="hidden">{user?.nickName}</DrawerTitle>
          <DrawerDescription className="hidden">{user?.note}</DrawerDescription>
          {mobileContent}
        </DrawerContent>
      </Drawer>
    );
  }

  // 桌面: HoverCard（悬浮卡片）
  return (
    <HoverCard onOpenChange={setIsOpen} openDelay={0}>
      <HoverCardTrigger asChild>
        <LinkWithLng href={`/account/${userId}`}>{children}</LinkWithLng>
      </HoverCardTrigger>
      <HoverCardContent
        className="w-100 border-0 bg-transparent p-0"
        align="start"
      >
        {cardContent}
      </HoverCardContent>
    </HoverCard>
  );
};
