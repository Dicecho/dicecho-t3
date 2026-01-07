import { Skeleton } from "@/components/ui/skeleton";
import { FeedbackListSkeleton } from "@/components/feedback";

export default function FeedbackLoading() {
  return (
    <div className="container pb-24 pt-14 md:pt-4">
      <div className="grid grid-cols-6 gap-8">
        <div className="col-span-6 md:col-span-4">
          <div className="mb-4 flex items-center gap-2">
            <Skeleton className="h-9 w-[200px]" />
          </div>
          <FeedbackListSkeleton />
        </div>
        <div className="hidden md:col-span-2 md:block">
          <div className="sticky top-20 space-y-4">
            <Skeleton className="h-[200px] w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
