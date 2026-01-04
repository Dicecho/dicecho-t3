import { AccountHeader } from "./AccountHeader";
import { AccountTabs } from "./AccountTabs";
import type { IUserDto } from "@dicecho/types";

interface AccountPageLayoutProps {
  user: IUserDto;
  lng: string;
}

export function AccountPageLayout({
  user,
  lng,
  children,
}: React.PropsWithChildren<AccountPageLayoutProps>) {
  return (
    <div className="pb-24">
      <AccountHeader user={user} lng={lng} />
      <AccountTabs user={user} lng={lng} />
      {children}
    </div>
  );
}
