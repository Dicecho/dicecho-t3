import { getServerAuthSession } from "@/server/auth";
import { getDicechoServerApi } from "@/server/dicecho";
import { AccountHeader } from "@/components/Account/AccountHeader";
import { AccountTabs } from "@/components/Account/AccountTabs";
import { MobileFooter } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
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

    return (
      <>
        <AccountHeader user={user} lng={lng} />
        <AccountTabs user={user} lng={lng} userId={id} />
        <div className="container mx-auto py-4">
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              收藏夹功能开发中...
            </CardContent>
          </Card>
        </div>
        <MobileFooter />
      </>
    );
  } catch (error) {
    notFound();
  }
}

