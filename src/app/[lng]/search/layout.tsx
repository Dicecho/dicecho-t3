import { Skeleton } from "@/components/ui/skeleton";
import { SearchLayout } from "./search-layout";
import { PropsWithChildren, Suspense } from "react";

export default function layout({
  children,
}: PropsWithChildren) {
  return (
    <Suspense
      fallback={
        <div className="container py-8">
          <div className="mb-6">
            <Skeleton className="mb-4 h-8 w-64 rounded" />
            <Skeleton className="h-12 w-full rounded" />
          </div>
        </div>
      }
    >
      <SearchLayout>{children}</SearchLayout>
    </Suspense>
  );
}
