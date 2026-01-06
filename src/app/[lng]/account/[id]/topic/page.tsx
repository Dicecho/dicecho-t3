import { AccountPageLayout } from "@/components/Account/account-page-layout";
import { MobileFooter } from "@/components/Footer";
import { getDicechoServerApi } from "@/server/dicecho";
import { notFound } from "next/navigation";
import { AccountTopicClient } from "./account-topic-client";

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

  const initialData = await api.topic.list(
    { filter: { author: id }, pageSize: 20, page: 1 },
    { revalidate: 60 }
  ).catch(() => null);

  return (
    <>
      <AccountPageLayout user={user} lng={lng}>
        <div className="container py-4">
          <AccountTopicClient
            lng={lng}
            userId={id}
            initialData={initialData}
          />
        </div>
      </AccountPageLayout>
      <MobileFooter />
    </>
  );
}
