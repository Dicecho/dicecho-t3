import { AccountPageLayout } from "@/components/Account/account-page-layout";
import { AccountFollowList } from "@/components/Account/AccountFollowList";
import { MobileFooter } from "@/components/Footer";
import { getDicechoServerApi } from "@/server/dicecho";
import { notFound } from "next/navigation";

// ISR with 60 seconds revalidation
export const revalidate = 60;

export default async function AccountFollowingsPage(props: {
  params: Promise<{ lng: string; id: string }>;
}) {
  const params = await props.params;
  const { lng, id } = params;

  const api = await getDicechoServerApi();
  const user = await api.user.profile(id, { revalidate: 300 }).catch(() => null);

  if (!user) {
    notFound();
  }

  return (
    <>
      <AccountPageLayout user={user} lng={lng}>
        <div className="container py-4">
          <AccountFollowList userId={id} type="followings" />
        </div>
      </AccountPageLayout>
      <MobileFooter />
    </>
  );
}
