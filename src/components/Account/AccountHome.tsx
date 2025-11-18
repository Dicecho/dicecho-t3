"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AccountModulesCard } from "./AccountModulesCard";
import { AccountRateList } from "./account-rate-list";
import type { IUserDto } from "@dicecho/types";
import { useAccount } from "@/hooks/useAccount";

interface AccountHomeProps {
  user: IUserDto;
}

export const AccountHome = ({ user }: AccountHomeProps) => {
  const { account, isAuthenticated } = useAccount();
  const isSelf = isAuthenticated && account._id === user._id;

  return (
    <div className="container mx-auto grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="col-span-1 flex flex-col gap-4 md:col-span-2">
        {/* Mobile: Show notice */}
        <Card className="md:hidden">
          <CardHeader>
            <CardTitle>简介</CardTitle>
          </CardHeader>
          <CardContent>
            {user.notice ? (
              user.notice
            ) : (
              <div className="text-muted-foreground">暂无简介</div>
            )}
          </CardContent>
        </Card>

        {/* Modules Card - only show for self */}
        {isSelf && <AccountModulesCard user={user} />}

        {/* Rate Card */}
        <AccountRateList userId={user._id} />
      </div>

      {/* Desktop: Sidebar with notice */}
      <div className="hidden md:col-span-1 md:block">
        <Card>
          <CardHeader>
            <CardTitle>简介</CardTitle>
          </CardHeader>
          <CardContent>
            {user.notice ? (
              user.notice
            ) : (
              <div className="text-muted-foreground">暂无简介</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
