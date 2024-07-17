import Link from "next/link";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { MobileFooter } from "@/components/Footer";
import { MobileHeader } from "@/components/Header/MobileHeader";
import { HeaderMenu } from "@/components/Header/HeaderMenu";
import { useTranslation } from "@/lib/i18n";

export default async function Home({
  params: { lng },
}: {
  params: { lng: string };
}) {
  const hello = await api.post.hello({ text: "from tRPC" });
  const { t } = await useTranslation(lng);
  const session = await getServerAuthSession();

  return (
    <>
      <MobileHeader>
        <HeaderMenu />
      </MobileHeader>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white max-md:pb-20">
        <div className="container flex flex-col items-center gap-2">
          <p className="text-2xl text-white">
            {hello ? hello.greeting : "Loading tRPC query..."}
          </p>

          <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-center text-2xl text-white">
              {session && <span>Logged in as {session.user.nickName}</span>}
            </p>
            <Link
              href={session ? "/api/auth/signout" : "/api/auth/signin"}
              className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
            >
              {session ? t("sign_out") : t("sign_in")}
            </Link>
          </div>
        </div>
      </main>
      <MobileFooter />
    </>
  );
}
