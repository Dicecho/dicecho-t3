import { Skeleton } from "@/components/ui/skeleton";

interface MobileCollectionCarouselSkeletonProps {
  title?: boolean;
}

export function MobileCollectionCarouselSkeleton({ title = true }: MobileCollectionCarouselSkeletonProps) {
  return (
    <div>
      {title && (
        <div className="mb-3 px-4">
          <Skeleton className="h-5 w-32" />
        </div>
      )}
      <div className="flex gap-4 overflow-hidden pl-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="w-[30%] shrink-0 space-y-1">
            <Skeleton className="aspect-square w-full rounded-sm" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
