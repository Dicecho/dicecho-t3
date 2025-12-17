import { getDicechoServerApi } from "@/server/dicecho";
import { AccountHeader } from "./AccountHeader";
import { AccountTabs } from "./AccountTabs";
import { AccountHome } from "./AccountHome";
import { notFound } from "next/navigation";

interface AccountProfileServerProps {
  userId: string;
  lng: string;
}

export async function AccountProfileServer({
  userId,
  lng,
}: AccountProfileServerProps) {
  const api = await getDicechoServerApi();
  // Cache user profile for 60 seconds (ISR)
  const user = await api.user.profile(userId, { revalidate: 300 }).catch(() => null);

  if (!user) {
    notFound();
  }

  return (
    <>
      <AccountHeader user={user} lng={lng} />
      <AccountTabs user={user} lng={lng} />
      <div className="container py-4 pb-24">
        <AccountHome user={user} />
      </div>
    </>
  );
}
