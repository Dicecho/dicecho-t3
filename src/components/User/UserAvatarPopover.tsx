"use client";

import { type ReactNode, type FC, useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { UserInfoCard, UserInfoCardSkeleton } from "./UserInfoCard";
import { useDicecho } from "@/hooks/useDicecho";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { cn } from "@/lib/utils";

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
  const { data: session } = useSession();
  const { api } = useDicecho();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  // React Query 自动处理一切
  const { data: user, isLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => api.user.profile(userId),
    enabled: isOpen,
    staleTime: 5 * 60 * 1000,
  });

  // 关注操作
  const followMutation = useMutation({
    mutationFn: () => api.user.follow(userId),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["user", userId], updatedUser);
    },
  });

  // 取关操作
  const unfollowMutation = useMutation({
    mutationFn: () => api.user.unfollow(userId),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["user", userId], updatedUser);
    },
  });

  const isFollowLoading =
    followMutation.isPending || unfollowMutation.isPending;
  const isFollowed = user?.isFollowed;

  // 操作按钮 (传递给 UserInfoCard)
  const actions =
    session?.user?._id === userId ? null : (
      <div className="flex gap-2">
        {isFollowed ? (
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            disabled={isFollowLoading}
            onClick={() => unfollowMutation.mutate()}
          >
            取消关注
          </Button>
        ) : (
          <Button
            variant="default"
            size="sm"
            className="flex-1"
            disabled={isFollowLoading}
            onClick={() => followMutation.mutate()}
          >
            关注
          </Button>
        )}
      </div>
    );

  const cardContent =
    isLoading || !user ? (
      <UserInfoCardSkeleton className={cn({ ["w-full"]: isMobile })} />
    ) : (
      <UserInfoCard
        user={user}
        actions={actions}
        className={cn({ ["w-full"]: isMobile })}
      />
    );

  // 移动端: Drawer
  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>{children}</DrawerTrigger>
        <DrawerContent className="h-auto w-full border-0 rounded-t-lg overflow-hidden">{cardContent}</DrawerContent>
      </Drawer>
    );
  }

  // 桌面: Popover (hover + click)
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        asChild
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        {children}
      </PopoverTrigger>
      <PopoverContent
        className="w-auto border-0 bg-transparent p-0 shadow-none"
        align="start"
        sideOffset={8}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div className="bg-card rounded-lg border">{cardContent}</div>
      </PopoverContent>
    </Popover>
  );
};
