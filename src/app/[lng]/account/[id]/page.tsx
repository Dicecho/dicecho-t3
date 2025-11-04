import { getServerAuthSession } from "@/server/auth";
import { MobileFooter } from "@/components/Footer";

export default async function AccountDetailPage(
  props: {
    params: Promise<{ lng: string; id: string }>;
  }
) {
  const params = await props.params;

  const {
    lng,
    id
  } = params;

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
