import type { Metadata } from "next";
import { HydrateClient, api } from "@/trpc/server";
import { RateDetailClient } from "./rate-detail-client";
import { notFound } from "next/navigation";

export const dynamic = "auto";

// ISR with 5 minutes revalidation (rate content rarely changes)
export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lng: string; id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  const rate = await api.rate.detail({ id }).catch(() => null);

  if (!rate) {
    return {
      title: "Rate - Dicecho",
      description: "TRPG review on Dicecho",
    };
  }

  const title = `${rate.user.nickName} 的评价 - ${rate.mod?.title ?? "Dicecho"}`;
  const description =
    rate.remark?.slice(0, 160) || `${rate.user.nickName} 对 ${rate.mod?.title} 的评价`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      siteName: "Dicecho",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

const RateDetailPage = async (props: {
  params: Promise<{ lng: string; id: string }>;
}) => {
  const params = await props.params;
  const { id } = params;

  // Server-side: fetch public data (no userId)
  const rate = await api.rate.detail({ id }).catch(() => null);

  if (!rate) {
    return notFound();
  }

  return (
    <HydrateClient>
      <div className="md:container grid grid-cols-6 gap-8">
        <div className="col-span-6 md:col-span-4">
          <RateDetailClient rateId={id} />
        </div>
      </div>
    </HydrateClient>
  );
};

export default RateDetailPage;
