import { Suspense } from "react";
import { AccountPageServer } from "@/components/Account/AccountPageServer";
import { AccountPageSkeleton } from "@/components/Account/AccountPageSkeleton";
import { AccountRateList } from "@/components/Account/account-rate-list";
import { MobileFooter } from "@/components/Footer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// ISR with 60 seconds revalidation
export const revalidate = 60;

const RateListSkeleton = () => (
  <div className="container py-4">
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
          {[1, 2, 3, 4].map((i) => (
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
);

export default async function AccountRatePage(props: {
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
            <RateListSkeleton />
          </AccountPageSkeleton>
        }
      >
        <AccountPageServer userId={id} lng={lng}>
          {(user) => (
            <div className="container py-4">
              <AccountRateList userId={id} rateCount={user.rateCount} />
            </div>
          )}
        </AccountPageServer>
      </Suspense>
      <MobileFooter />
    </>
  );
}
