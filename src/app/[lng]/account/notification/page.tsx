import { getServerAuthSession } from "@/server/auth";
import { MobileFooter } from "@/components/Footer";
import { MobileHeader } from "@/components/Header/MobileHeader";
import { HeaderMenu } from "@/components/Header/HeaderMenu";
import { redirect } from "next/navigation";
import { NotificationPageContent } from "./notification-page-content";
import { getTranslation } from "@/lib/i18n";
import { MarkReadButton } from "@/components/notification";

export default async function NotificationPage(props: {
  params: Promise<{ lng: string }>;
}) {
  const params = await props.params;
  const { lng } = params;
  const { t } = await getTranslation(lng);

  const session = await getServerAuthSession();
  if (!session?.user) {
    redirect(`/${lng}/account`);
  }

  return (
    <>
      <MobileHeader
        left={<HeaderMenu />}
        right={<MarkReadButton variant="ghost" size="sm" />}
      >
        {t("notifications")}
      </MobileHeader>
      <NotificationPageContent />
      <MobileFooter />
    </>
  );
}
