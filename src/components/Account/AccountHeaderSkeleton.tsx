import { Skeleton } from "@/components/ui/skeleton";

// 桌面端 Header Skeleton
const DesktopHeaderSkeleton = ({ showTabs = true }: { showTabs?: boolean }) => {
  return (
    <div className="relative hidden min-h-100 flex-col items-center md:flex">
      {/* 背景图 */}
      <div className="bg-muted absolute inset-0 -z-10">
        <div className="to-background absolute inset-0 bg-gradient-to-b from-transparent" />
      </div>

      {/* 头像 */}
      <div className="mt-10 mb-6">
        <Skeleton className="h-30 w-30 rounded-full" />
      </div>

      {/* 昵称 */}
      <Skeleton className="mb-2 h-8 w-40" />

      {/* 简介 */}
      <Skeleton className="mb-2 h-5 w-60" />

      {/* 统计数据 */}
      <div className="mb-4 flex w-40 items-center justify-between">
        <Skeleton className="h-10 w-12" />
        <Skeleton className="h-10 w-12" />
        <Skeleton className="h-10 w-12" />
      </div>

      {/* 操作按钮 */}
      <Skeleton className="h-10 w-32" />

      {/* 底部间距 */}
      <div className="mt-auto" />

      {/* Tab 栏 */}
      {showTabs && (
        <div className="my-10 flex h-8 justify-center gap-4">
          <Skeleton className="h-6 w-12" />
          <Skeleton className="h-6 w-12" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-12" />
        </div>
      )}
    </div>
  );
};

// 移动端 Header Skeleton
const MobileHeaderSkeleton = () => {
  return (
    <div className="bg-card md:hidden">
      {/* 背景图 */}
      <Skeleton className="h-42 w-full rounded-none" />

      {/* 用户信息区域 */}
      <div className="border-border container border-b pb-4">
        <div className="mb-4 flex">
          {/* 头像 */}
          <div className="z-1 -mt-8 mr-6 shrink-0">
            <Skeleton className="h-20 w-20 rounded-full" />
          </div>

          {/* 右侧：操作按钮 */}
          <div className="ml-auto">
            <Skeleton className="mt-4 h-8 w-32" />
          </div>
        </div>

        {/* 昵称 */}
        <Skeleton className="h-6 w-32" />

        {/* 简介 */}
        <Skeleton className="mt-2 h-4 w-48" />

        {/* 统计数据 */}
        <div className="mt-2 flex gap-4">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>
    </div>
  );
};

interface AccountHeaderSkeletonProps {
  showTabs?: boolean;
}

export const AccountHeaderSkeleton = ({
  showTabs = true,
}: AccountHeaderSkeletonProps) => {
  return (
    <>
      <DesktopHeaderSkeleton showTabs={showTabs} />
      <MobileHeaderSkeleton />
    </>
  );
};
