import { getDicechoServerApi } from "@/server/dicecho";
import { AccountHeader } from "./AccountHeader";
import { AccountTabs } from "./AccountTabs";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import type { IUserDto } from "@dicecho/types";

interface AccountPageServerProps {
  userId: string;
  lng: string;
  children: (user: IUserDto) => ReactNode;
}

export async function AccountPageServer({
  userId,
  lng,
  children,
}: AccountPageServerProps) {
  const api = await getDicechoServerApi();
  // Cache user profile for 60 seconds (ISR)
  const user = await api.user.profile(userId, { revalidate: 300 }).catch(() => null);

  if (!user) {
    notFound();
  }

  return (
    <div className="pb-24">
      <AccountHeader user={user} lng={lng} />
      <AccountTabs user={user} lng={lng} />
      {children(user)}
    </div>
  );
}
