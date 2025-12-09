import { getServerAuthSession } from "@/server/auth";
import { getDicechoServerApi } from "@/server/dicecho";
import { AccountHeader } from "@/components/Account/AccountHeader";
import { AccountTabs } from "@/components/Account/AccountTabs";
import { AccountSettings } from "@/components/Account/AccountSettings";
import { MobileFooter } from "@/components/Footer";
import { redirect, notFound } from "next/navigation";

export default async function AccountSettingPage(
  props: {
    params: Promise<{ lng: string; id: string }>;
  }
) {
  const params = await props.params;
  const { lng, id } = params;

  const session = await getServerAuthSession();
  const api = await getDicechoServerApi();

  // Only allow users to access their own settings
  if (!session || session.user._id !== id) {
    redirect(`/${lng}/account/${id}`);
  }

  try {
    const user = await api.user.profile(id);

    return (
      <>
        <AccountHeader user={user} lng={lng} />
        <AccountTabs user={user} lng={lng} userId={id} />
        <div className="container py-4">
          <AccountSettings user={user} />
        </div>
        <MobileFooter />
      </>
    );
  } catch (error) {
    notFound();
  }
}

