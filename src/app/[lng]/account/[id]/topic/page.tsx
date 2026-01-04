import { AccountPageLayout } from "@/components/Account/account-page-layout";
import { MobileFooter } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { getDicechoServerApi } from "@/server/dicecho";
import { notFound } from "next/navigation";

// ISR with 60 seconds revalidation
export const revalidate = 60;

export default async function AccountTopicPage(props: {
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
          <Card>
            <CardContent className="text-muted-foreground p-8 text-center">
              帖子功能开发中...
            </CardContent>
          </Card>
        </div>
      </AccountPageLayout>
      <MobileFooter />
    </>
  );
}
