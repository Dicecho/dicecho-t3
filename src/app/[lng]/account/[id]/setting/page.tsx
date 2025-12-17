import { Suspense } from "react";
import { getServerAuthSession } from "@/server/auth";
import { AccountPageServer } from "@/components/Account/AccountPageServer";
import { AccountPageSkeleton } from "@/components/Account/AccountPageSkeleton";
import { AccountSettings } from "@/components/Account/AccountSettings";
import { MobileFooter } from "@/components/Footer";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const SettingsContentSkeleton = () => (
  <div className="container py-4">
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="h-10 w-24" />
      </CardContent>
    </Card>
  </div>
);

export default async function AccountSettingPage(props: {
  params: Promise<{ lng: string; id: string }>;
}) {
  const params = await props.params;
  const { lng, id } = params;

  const session = await getServerAuthSession();

  // Only allow users to access their own settings
  if (!session || session.user._id !== id) {
    redirect(`/${lng}/account/${id}`);
  }

  return (
    <>
      <Suspense
        key={id}
        fallback={
          <AccountPageSkeleton>
            <SettingsContentSkeleton />
          </AccountPageSkeleton>
        }
      >
        <AccountPageServer userId={id} lng={lng}>
          {(user) => (
            <div className="container py-4">
              <AccountSettings user={user} />
            </div>
          )}
        </AccountPageServer>
      </Suspense>
      <MobileFooter />
    </>
  );
}
