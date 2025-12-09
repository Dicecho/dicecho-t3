import { getServerAuthSession } from "@/server/auth";
import { MobileFooter } from "@/components/Footer";
import { MobileHeader } from "@/components/Header/MobileHeader";
import { HeaderMenu } from "@/components/Header/HeaderMenu";
import { redirect } from "next/navigation";
import { SignIn } from "./SignIn";

export default async function AccountPage(
  props: {
    params: Promise<{ lng: string }>;
  }
) {
  const params = await props.params;

  const {
    lng
  } = params;

  const session = await getServerAuthSession();
  if (session?.user) {
    redirect(`/${lng}/account/${session.user.id}`);
  }

  return (
    <>
      <MobileHeader left={<HeaderMenu />}>
      </MobileHeader>
      <main className="flex min-h-screen items-center justify-center w-full">
        <SignIn />
      </main>
      <MobileFooter />
    </>
  );
}
