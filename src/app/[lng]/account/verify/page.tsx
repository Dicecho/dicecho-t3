import { MobileFooter } from "@/components/Footer";
import { MobileHeader } from "@/components/Header/MobileHeader";
import { HeaderMenu } from "@/components/Header/HeaderMenu";
import { VerifyPageContent } from "./verify-page-content";
import { getTranslation } from "@/lib/i18n";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default async function VerifyPage(props: {
  params: Promise<{ lng: string }>;
}) {
  const params = await props.params;
  const { lng } = params;
  const { t } = await getTranslation(lng);

  return (
    <>
      <MobileHeader left={<HeaderMenu />}>{t("activate_account")}</MobileHeader>
      <div className="container py-10 px-4">
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-[320px]">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          }
        >
          <VerifyPageContent />
        </Suspense>
      </div>
      <MobileFooter />
    </>
  );
}
