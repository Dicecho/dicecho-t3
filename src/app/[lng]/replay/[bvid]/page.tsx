import { notFound } from "next/navigation";
import { getDicechoServerApi } from "@/server/dicecho";
import { MobileHeader } from "@/components/Header/MobileHeader";
import { HeaderBack } from "@/components/Header/HeaderBack";
import { MobileFooter } from "@/components/Footer";
import { ReplayDetailClient } from "./replay-detail-client";
import type { Metadata } from "next";

export const dynamic = "auto";
export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lng: string; bvid: string }>;
}): Promise<Metadata> {
  const { lng, bvid } = await params;
  const api = await getDicechoServerApi();
  const replay = await api.replay.detail(bvid).catch(() => null);

  if (!replay) {
    return { title: "Replay - Dicecho" };
  }

  return {
    title: `${replay.title} - Dicecho`,
    description: replay.description?.slice(0, 160),
    openGraph: {
      title: replay.title,
      description: replay.description,
      images: [replay.coverUrl],
      type: "video.other",
    },
    alternates: {
      canonical: `/${lng}/replay/${bvid}`,
      languages: {
        en: `/en/replay/${bvid}`,
        zh: `/zh/replay/${bvid}`,
        ja: `/ja/replay/${bvid}`,
        ko: `/ko/replay/${bvid}`,
      },
    },
  };
}

export default async function ReplayDetailPage({
  params,
}: {
  params: Promise<{ lng: string; bvid: string }>;
}) {
  const { lng, bvid } = await params;
  const api = await getDicechoServerApi();
  const replay = await api.replay.detail(bvid).catch(() => null);

  if (!replay) {
    return notFound();
  }

  return (
    <>
      <MobileHeader left={<HeaderBack fallback="/replay" />}>
        <span className="line-clamp-1 text-sm font-medium text-center">{replay.title}</span>
      </MobileHeader>

      <div className="pb-24 md:container md:pt-4">
        <ReplayDetailClient replay={replay} lng={lng} />
      </div>

      <MobileFooter />
    </>
  );
}
