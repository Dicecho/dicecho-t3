import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { api } from "@/trpc/server";
import { getTranslation } from "@/lib/i18n";
import { MobileFooter } from "@/components/Footer";
import { FeedbackDetailClient } from "./feedback-detail-client";

export const dynamic = "auto";
export const revalidate = 60;

interface FeedbackDetailPageProps {
  params: Promise<{ lng: string; number: string }>;
}

export async function generateMetadata({
  params,
}: FeedbackDetailPageProps): Promise<Metadata> {
  const { lng, number } = await params;
  const issueNumber = parseInt(number, 10);

  if (isNaN(issueNumber)) {
    return { title: "Not Found" };
  }

  try {
    const { issue } = await api.feedback.detail({ number: issueNumber });
    const { t } = await getTranslation(lng);

    return {
      title: `${issue.title} · #${issue.number} · ${t("feedback")}`,
      description: issue.body?.slice(0, 160) ?? undefined,
      alternates: {
        canonical: `/${lng}/feedback/${issue.number}`,
        languages: {
          en: `/en/feedback/${issue.number}`,
          ja: `/ja/feedback/${issue.number}`,
          zh: `/zh/feedback/${issue.number}`,
          ko: `/ko/feedback/${issue.number}`,
        },
      },
    };
  } catch {
    return { title: "Not Found" };
  }
}

export default async function FeedbackDetailPage({
  params,
}: FeedbackDetailPageProps) {
  const { lng, number } = await params;
  const issueNumber = parseInt(number, 10);

  if (isNaN(issueNumber)) {
    notFound();
  }

  try {
    const { issue, comments } = await api.feedback.detail({ number: issueNumber });

    return (
      <>
        <FeedbackDetailClient lng={lng} issue={issue} comments={comments} />
        <MobileFooter />
      </>
    );
  } catch {
    notFound();
  }
}
