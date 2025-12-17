import { Suspense } from "react";
import { getServerAuthSession } from "@/server/auth";
import { AccountPageServer } from "@/components/Account/AccountPageServer";
import { AccountPageSkeleton } from "@/components/Account/AccountPageSkeleton";
import { MobileFooter } from "@/components/Footer";
import { AccountCollection } from "@/components/Account/AccountCollection";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// ISR with 60 seconds revalidation
export const revalidate = 60;

const CollectionContentSkeleton = () => (
  <div className="container py-4">
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="mb-2 h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default async function AccountCollectionPage(props: {
  params: Promise<{ lng: string; id: string }>;
}) {
  const params = await props.params;
  const { lng, id } = params;

  const session = await getServerAuthSession();
  const isSelf = session?.user?._id === id;

  return (
    <>
      <Suspense
        key={id}
        fallback={
          <AccountPageSkeleton>
            <CollectionContentSkeleton />
          </AccountPageSkeleton>
        }
      >
        <AccountPageServer userId={id} lng={lng}>
          {() => (
            <div className="container py-4">
              <AccountCollection userId={id} isSelf={isSelf} />
            </div>
          )}
        </AccountPageServer>
      </Suspense>
      <MobileFooter />
    </>
  );
}
