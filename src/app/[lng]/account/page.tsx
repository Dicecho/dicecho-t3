import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function AccountPage(props: {
  params: Promise<{ lng: string }>;
}) {
  const params = await props.params;
  const { lng } = params;

  const session = await getServerAuthSession();
  if (session?.user) {
    redirect(`/${lng}/account/${session.user.id}`);
  }

  redirect(`/${lng}/account/signin`);
}
