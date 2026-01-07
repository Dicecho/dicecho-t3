import type { Metadata } from "next";
import { MobileFooter } from "@/components/Footer";
import { MobileHeader } from "@/components/Header/MobileHeader";
import { HeaderMenu } from "@/components/Header/HeaderMenu";
import { NotificationReminder } from "@/components/Header/notification-reminder";
import { getTranslation } from "@/lib/i18n";
import { FeedbackPageClient } from "./feedback-page-client";

export const dynamic = "auto";
export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lng: string }>;
}): Promise<Metadata> {
  const { lng } = await params;
  const { t } = await getTranslation(lng);

  return {
    title: t("feedback"),
    description: t("feedback_description"),
    alternates: {
      canonical: `/${lng}/feedback`,
      languages: {
        en: "/en/feedback",
        ja: "/ja/feedback",
        zh: "/zh/feedback",
        ko: "/ko/feedback",
      },
    },
  };
}

export default async function FeedbackPage({
  params,
}: {
  params: Promise<{ lng: string }>;
}) {
  const { lng } = await params;
  const { t } = await getTranslation(lng);

  return (
    <>
      <MobileHeader left={<HeaderMenu />} right={<NotificationReminder />}>
        <span>{t("feedback")}</span>
      </MobileHeader>

      <div className="container pb-24 md:pt-4">
        <FeedbackPageClient lng={lng} />
      </div>

      <MobileFooter />
    </>
  );
}
