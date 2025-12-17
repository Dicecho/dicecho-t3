import { Skeleton } from "@/components/ui/skeleton";

export const AccountTabsSkeleton = () => {
  // 只在移动端显示，桌面端 Tab 在 AccountHeader 内
  return (
    <div className="sticky top-0 z-10 flex justify-center bg-card/80 shadow-md backdrop-blur md:hidden supports-backdrop-filter:bg-card/70">
      <div className="container flex justify-center gap-4 py-4">
        <Skeleton className="h-5 w-10" />
        <Skeleton className="h-5 w-10" />
        <Skeleton className="h-5 w-14" />
        <Skeleton className="h-5 w-10" />
      </div>
    </div>
  );
};
