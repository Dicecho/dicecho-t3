import { getServerAuthSession } from "@/server/auth";
import { getDicechoServerApi } from "@/server/dicecho";
import { redirect, notFound } from "next/navigation";
import { SettingsPageLayout } from "@/components/Account/settings-page-layout";
import { SettingsPageContent } from "@/components/Account/settings-page-content";
import { AccountPageLayout } from "@/components/Account/account-page-layout";
import { PasswordForm } from "@/components/Account/password-form";
import { MobileFooter } from "@/components/Footer";
import { getTranslation } from "@/lib/i18n";

export default async function PasswordSettingPage(props: {
  params: Promise<{ lng: string; id: string }>;
}) {
  const params = await props.params;
  const { lng, id } = params;

  const [session, api, { t }] = await Promise.all([
    getServerAuthSession(),
    getDicechoServerApi(),
    getTranslation(lng),
  ]);

  if (!session || session.user._id !== id) {
    redirect(`/${lng}/account/${id}`);
  }

  const user = await api.user.profile(id, { revalidate: 300 }).catch(() => null);

  if (!user) {
    notFound();
  }

  return (
    <>
      {/* Mobile: Use SettingsPageLayout with back button */}
      <div className="md:hidden">
        <SettingsPageLayout
          title={t("settings_menu_password")}
          backHref={`/${lng}/account/${id}/setting`}
        >
          <PasswordForm showCard={false} />
        </SettingsPageLayout>
      </div>

      {/* Desktop: Use AccountPageLayout to keep AccountHeader */}
      <div className="hidden md:block">
        <AccountPageLayout user={user} lng={lng}>
          <div className="container py-4">
            <SettingsPageContent user={user} userId={id} lng={lng}>
              <PasswordForm />
            </SettingsPageContent>
          </div>
        </AccountPageLayout>
      </div>

      <MobileFooter />
    </>
  );
}
