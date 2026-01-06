import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { MobileHeader } from "@/components/Header/MobileHeader";
import { Button } from "@/components/ui/button";
import { MobileFooter } from "@/components/Footer";
import { AppSettingsContent } from "@/components/Setting/app-settings-content";
import { getTranslation } from "@/lib/i18n";

export default async function SettingPage(props: {
  params: Promise<{ lng: string }>;
}) {
  const params = await props.params;
  const { lng } = params;
  const { t } = await getTranslation(lng);

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden">
        <MobileHeader
          left={
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/${lng}`}>
                <ChevronLeft className="h-5 w-5" />
              </Link>
            </Button>
          }
        >
          <h1 className="text-center text-sm font-medium truncate">
            {t("app_settings_title")}
          </h1>
        </MobileHeader>
      </div>

      <div className="container py-4 max-w-2xl mx-auto">
        <h1 className="hidden md:block text-2xl font-bold mb-6">
          {t("app_settings_title")}
        </h1>
        <AppSettingsContent lng={lng} />
      </div>

      <MobileFooter />
    </>
  );
}
