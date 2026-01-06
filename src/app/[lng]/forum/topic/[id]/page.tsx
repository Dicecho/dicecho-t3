import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDicechoServerApi } from "@/server/dicecho";
import { TopicDetailClient } from "./topic-detail-client";
import { TopicDetailHeader } from "./topic-detail-header";

export const dynamic = "auto";
export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lng: string; id: string }>;
}): Promise<Metadata> {
  const { id, lng } = await params;

  const api = await getDicechoServerApi();
  const topic = await api.topic.detail(id, { revalidate: 60 }).catch(() => null);

  if (!topic) {
    return {
      title: "Topic - Dicecho",
      description: "Forum topic on Dicecho",
    };
  }

  const title = topic.title;
  const description = topic.content.slice(0, 160);

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
    alternates: {
      canonical: `/${lng}/forum/topic/${id}`,
      languages: {
        en: `/en/forum/topic/${id}`,
        ja: `/ja/forum/topic/${id}`,
        zh: `/zh/forum/topic/${id}`,
        ko: `/ko/forum/topic/${id}`,
      },
    },
  };
}

export default async function TopicDetailPage({
  params,
}: {
  params: Promise<{ lng: string; id: string }>;
}) {
  const { lng, id } = await params;

  const api = await getDicechoServerApi();
  const topic = await api.topic.detail(id, { revalidate: 60 }).catch(() => null);

  if (!topic) {
    return notFound();
  }

  return (
    <>
      <TopicDetailHeader title={topic.title} />

      <div className="md:container pt-14 md:pt-4">
        <TopicDetailClient topic={topic} lng={lng} />
      </div>
    </>
  );
}
