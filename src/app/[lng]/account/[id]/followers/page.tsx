import { getDicechoServerApi } from "@/server/dicecho";
import { AccountHeader } from "@/components/Account/AccountHeader";
import { AccountTabs } from "@/components/Account/AccountTabs";
import { AccountFollowList } from "@/components/Account/AccountFollowList";
import { MobileFooter } from "@/components/Footer";
import { notFound } from "next/navigation";

export default async function AccountFollowersPage(
  props: {
    params: Promise<{ lng: string; id: string }>;
  }
) {
  const params = await props.params;
  const { lng, id } = params;

  const api = await getDicechoServerApi();

  try {
    const user = await api.user.profile(id);

    return (
      <>
        <AccountHeader user={user} lng={lng} />
        <AccountTabs user={user} lng={lng} userId={id} />
        <div className="container py-4">
          <AccountFollowList userId={id} type="followers" />
        </div>
        <MobileFooter />
      </>
    );
  } catch (error) {
    notFound();
  }
}

