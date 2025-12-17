import { Suspense } from "react";
import { AccountPageServer } from "@/components/Account/AccountPageServer";
import { AccountPageSkeleton } from "@/components/Account/AccountPageSkeleton";
import { MobileFooter } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// ISR with 60 seconds revalidation
export const revalidate = 60;

const TopicContentSkeleton = () => (
  <div className="container py-4">
    <Card>
      <CardContent className="p-8">
        <Skeleton className="mx-auto h-6 w-40" />
      </CardContent>
    </Card>
  </div>
);

export default async function AccountTopicPage(props: {
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
            <TopicContentSkeleton />
          </AccountPageSkeleton>
        }
      >
        <AccountPageServer userId={id} lng={lng}>
          {() => (
            <div className="container py-4">
              <Card>
                <CardContent className="text-muted-foreground p-8 text-center">
                  帖子功能开发中...
                </CardContent>
              </Card>
            </div>
          )}
        </AccountPageServer>
      </Suspense>
      <MobileFooter />
    </>
  );
}
