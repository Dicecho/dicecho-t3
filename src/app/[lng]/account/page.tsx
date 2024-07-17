import { getServerAuthSession } from "@/server/auth";
import { MobileFooter } from "@/components/Footer";
import { MobileHeader } from "@/components/Header/MobileHeader";
import { HeaderMenu } from "@/components/Header/HeaderMenu";
import { redirect } from "next/navigation";
import { SignIn } from "./SignIn";

export default async function AccountPage({
  params: { lng },
}: {
  params: { lng: string };
}) {
  const session = await getServerAuthSession();
  if (session?.user) {
    redirect(`/${lng}/account/${session.user.id}`);
  }

  return (
    <>
      <MobileHeader>
        <HeaderMenu />
      </MobileHeader>
      <main className="container flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white max-md:pb-20">
        <SignIn />
      </main>
      <MobileFooter />
    </>
  );
}
