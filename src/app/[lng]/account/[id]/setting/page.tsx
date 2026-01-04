import { getServerAuthSession } from "@/server/auth";
import { AccountPageLayout } from "@/components/Account/account-page-layout";
import { AccountSettings } from "@/components/Account/AccountSettings";
import { MobileFooter } from "@/components/Footer";
import { getDicechoServerApi } from "@/server/dicecho";
import { redirect, notFound } from "next/navigation";

export default async function AccountSettingPage(props: {
  params: Promise<{ lng: string; id: string }>;
}) {
  const params = await props.params;
  const { lng, id } = params;

  const [session, api] = await Promise.all([
    getServerAuthSession(),
    getDicechoServerApi(),
  ]);

  // Only allow users to access their own settings
  if (!session || session.user._id !== id) {
    redirect(`/${lng}/account/${id}`);
  }

  const user = await api.user.profile(id, { revalidate: 300 }).catch(() => null);

  if (!user) {
    notFound();
  }

  return (
    <>
      <AccountPageLayout user={user} lng={lng}>
        <div className="container py-4">
          <AccountSettings user={user} />
        </div>
      </AccountPageLayout>
      <MobileFooter />
    </>
  );
}
