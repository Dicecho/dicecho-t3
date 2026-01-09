import { getServerAuthSession } from "@/server/auth";
import { MobileFooter } from "@/components/Footer";
import { MobileHeader } from "@/components/Header/MobileHeader";
import { HeaderMenu } from "@/components/Header/HeaderMenu";
import { redirect } from "next/navigation";
import { SigninPageContent } from "./signin-page-content";
import { getTranslation } from "@/lib/i18n";

export default async function SigninPage(props: {
  params: Promise<{ lng: string }>;
}) {
  const params = await props.params;
  const { lng } = params;
  const { t } = await getTranslation(lng);

  const session = await getServerAuthSession();
  if (session?.user) {
    redirect(`/${lng}/account/${session.user.id}`);
  }

  return (
    <>
      <MobileHeader left={<HeaderMenu />}>{t("sign_in")}</MobileHeader>
      <main className="flex justify-center w-full">
        <SigninPageContent />
      </main>
      <MobileFooter />
    </>
  );
}
