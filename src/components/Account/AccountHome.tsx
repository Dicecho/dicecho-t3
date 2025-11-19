"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AccountModulesCard } from "./AccountModulesCard";
import { AccountRateList } from "./account-rate-list";
import type { IUserDto } from "@dicecho/types";
import { useAccount } from "@/hooks/useAccount";
import { useTranslation } from "@/lib/i18n/react";

interface AccountHomeProps {
  user: IUserDto;
}

export const AccountHome = ({ user }: AccountHomeProps) => {
  const { account, isAuthenticated } = useAccount();
  const { t } = useTranslation();
  const isSelf = isAuthenticated && account._id === user._id;

  const renderNotice = () =>
    user.notice ? (
      user.notice
    ) : (
      <div className="text-muted-foreground">{t("profile_notice_empty")}</div>
    );

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <div className="flex flex-col gap-4">
        <Card className="md:hidden">
          <CardHeader>
            <CardTitle>{t("profile_about")}</CardTitle>
          </CardHeader>
          <CardContent>{renderNotice()}</CardContent>
        </Card>

        {isSelf && <AccountModulesCard user={user} />}

        <AccountRateList userId={user._id} rateCount={user.rateCount} />
      </div>

      <div className="hidden md:block">
        <Card>
          <CardHeader>
            <CardTitle>{t("profile_about")}</CardTitle>
          </CardHeader>
          <CardContent>{renderNotice()}</CardContent>
        </Card>
      </div>
    </div>
  );
};
