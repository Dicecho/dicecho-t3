import type { Metadata } from "next";
import { AccountPageLayout } from "@/components/Account/account-page-layout";
import { AccountHome } from "@/components/Account/AccountHome";
import { MobileFooter } from "@/components/Footer";
import { getDicechoServerApi } from "@/server/dicecho";
import { notFound } from "next/navigation";

// Let Next.js decide the rendering strategy based on usage
export const dynamic = "auto";

// ISR with 60 seconds revalidation
export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lng: string; id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  const api = await getDicechoServerApi();
  const user = await api.user.profile(id, { revalidate: 60 }).catch(() => null);

  if (!user) {
    return {
      title: "User - Dicecho",
      description: "User profile on Dicecho",
    };
  }

  const title = `${user.nickName} | Dicecho`;
  const description = user.note || `${user.nickName}'s profile on Dicecho`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: user.avatarUrl ? [{ url: user.avatarUrl }] : [],
      type: "profile",
      siteName: "Dicecho",
    },
  };
}

export default async function AccountDetailPage(props: {
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
          <AccountHome user={user} />
        </div>
      </AccountPageLayout>
      <MobileFooter />
    </>
  );
}
