import { Suspense } from "react";
import { AccountPageServer } from "@/components/Account/AccountPageServer";
import { AccountPageSkeleton } from "@/components/Account/AccountPageSkeleton";
import { AccountFollowList } from "@/components/Account/AccountFollowList";
import { MobileFooter } from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";

// ISR with 60 seconds revalidation
export const revalidate = 60;

const FollowListSkeleton = () => (
  <div className="container py-4">
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="flex items-center gap-4 rounded-lg border p-4"
        >
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1">
            <Skeleton className="mb-2 h-4 w-24" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default async function AccountFollowingsPage(props: {
  params: Promise<{ lng: string; id: string }>;
}) {
  const params = await props.params;
  const { lng, id } = params;

  return (
    <>
      <Suspense
        key={id}
        fallback={
          <AccountPageSkeleton>
            <FollowListSkeleton />
          </AccountPageSkeleton>
        }
      >
        <AccountPageServer userId={id} lng={lng}>
          {() => (
            <div className="container py-4">
              <AccountFollowList userId={id} type="followings" />
            </div>
          )}
        </AccountPageServer>
      </Suspense>
      <MobileFooter />
    </>
  );
}
