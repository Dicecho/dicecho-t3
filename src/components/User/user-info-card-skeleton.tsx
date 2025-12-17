import type { FC } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * UserInfoCardSkeleton - 加载状态骨架屏（桌面版）
 */
export const UserInfoCardSkeleton: FC<{ className?: string }> = ({
  className,
}) => {
  return (
    <div
      className={cn(
        "bg-card text-card-foreground relative w-full overflow-hidden rounded-lg border",
        "aspect-[2/1]",
        className,
      )}
    >
      {/* 背景图层（匹配 UserInfoCard 的背景效果） */}
      <div className="bg-muted absolute inset-0">
        <Skeleton className="absolute inset-0 rounded-none" />
        <div className="bg-background/70 absolute inset-0" />
      </div>
      {/* 前景内容 */}
      <div className="relative flex h-full flex-col p-4">
        {/* 用户信息区 */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full border-background" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-full" />
          </div>
        </div>

        {/* 底部数据区（匹配 UserInfoCard 的文本样式） */}
        <div className="mt-auto flex items-center pt-3 text-xs">
          <div className="text-foreground flex flex-1 items-center gap-2">
            <div className="space-x-2 text-center">
              <Skeleton className="inline-block h-3 w-8" />
              <Skeleton className="inline-block h-3 w-12" />
            </div>
            <div className="bg-border h-2 w-px" />
            <div className="space-x-2 text-center">
              <Skeleton className="inline-block h-3 w-8" />
              <Skeleton className="inline-block h-3 w-12" />
            </div>
            <div className="bg-border h-2 w-px" />
            <div className="space-x-2 text-center">
              <Skeleton className="inline-block h-3 w-8" />
              <Skeleton className="inline-block h-3 w-12" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * MobileUserInfoCardSkeleton - 加载状态骨架屏（移动版）
 */
export const MobileUserInfoCardSkeleton: FC<{ className?: string }> = ({
  className,
}) => {
  return (
    <div className={cn("bg-background", className)}>
      {/* 顶部背景图区域 */}
      <Skeleton className="h-32 w-full rounded-none" />

      {/* 用户信息与统计、操作区 */}
      <div className="px-4 pb-6">
        <div className="flex items-start gap-4">
          {/* 头像（大号、带边框） */}
          <div className="-mt-10 shrink-0">
            <div className="relative">
              <div className="bg-background rounded-full p-1">
                <Skeleton className="h-20 w-20 rounded-full border-2 border-background" />
              </div>
            </div>
          </div>
        </div>

        {/* 昵称与个性签名 */}
        <div className="space-y-2">
          <Skeleton className="mb-2 h-6 w-32" />
          <Skeleton className="h-4 w-full" />
          {/* 统计数据 */}
          <div className="text-foreground flex items-center space-x-4 text-sm">
            <span className="flex items-center space-x-2">
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-3 w-12" />
            </span>
            <span className="bg-border h-2 w-px" />
            <span className="flex items-center space-x-2">
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-3 w-12" />
            </span>
            <span className="bg-border h-2 w-px" />
            <span className="flex items-center space-x-2">
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-3 w-12" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
