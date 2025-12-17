import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const AccountHomeSkeleton = () => {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <div className="flex flex-col gap-4">
        {/* 移动端关于卡片 */}
        <Card className="md:hidden">
          <CardHeader>
            <Skeleton className="h-6 w-20" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>

        {/* 评价列表骨架 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
              <div className="ml-auto flex gap-2">
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 border-b pb-4">
                  <Skeleton className="h-24 w-20 shrink-0 rounded" />
                  <div className="flex-1">
                    <Skeleton className="mb-2 h-5 w-3/4" />
                    <Skeleton className="mb-2 h-4 w-1/2" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 桌面端关于卡片 */}
      <div className="hidden md:block">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-20" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
