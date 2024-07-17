import { getServerAuthSession } from "@/server/auth";
import { MobileFooter } from "@/components/Footer";

export default async function AccountDetailPage({
  params: { lng, id },
}: {
  params: { lng: string; id: string };
}) {
  const session = await getServerAuthSession();
  const isMe = session?.user._id === id

  return (
    <>
      <main className="container flex min-h-screen">
        working...

      </main>
      <MobileFooter />
    </>
  );
}
