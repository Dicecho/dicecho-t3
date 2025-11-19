import { getServerAuthSession } from "@/server/auth";
import { getDicechoServerApi } from "@/server/dicecho";
import { AccountHeader } from "@/components/Account/AccountHeader";
import { AccountTabs } from "@/components/Account/AccountTabs";
import { MobileFooter } from "@/components/Footer";
import { AccountCollection } from "@/components/Account/AccountCollection";
import { notFound } from "next/navigation";

export default async function AccountCollectionPage(
  props: {
    params: Promise<{ lng: string; id: string }>;
  }
) {
  const params = await props.params;
  const { lng, id } = params;

  const session = await getServerAuthSession();
  const api = await getDicechoServerApi();

  try {
    const user = await api.user.profile(id);

    const isSelf = session?.user?._id === id;

    return (
      <>
        <AccountHeader user={user} lng={lng} />
        <AccountTabs user={user} lng={lng} userId={id} />
        <div className="container mx-auto py-4">
          <AccountCollection userId={id} isSelf={isSelf} />
        </div>
        <MobileFooter />
      </>
    );
  } catch (error) {
    notFound();
  }
}

