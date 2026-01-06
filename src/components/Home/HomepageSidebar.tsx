"use client";

import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/react";
import { useSession } from "next-auth/react";
import { LinkWithLng } from "@/components/Link";
import { HomepageProfile } from "./HomepageProfile";
import { HomepageActions } from "./HomepageActions";
import type { FC, PropsWithChildren } from "react";

interface HomepageSidebarProps {}

export const HomepageSidebar: FC<PropsWithChildren<HomepageSidebarProps>> = ({
  children,
}) => {
  const { t } = useTranslation();
  const params = useParams();
  const lng = (params.lng as string) || "en";
  const { data: session, status } = useSession();
  const user = session?.user;

  if (status === "loading") {
    return (
      <div className="flex flex-col gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center animate-pulse">
              <div className="h-16 w-16 rounded-full bg-muted" />
              <div className="mt-4 h-5 w-24 rounded bg-muted" />
              <div className="mt-4 flex gap-4">
                <div className="h-10 w-16 rounded bg-muted" />
                <div className="h-10 w-16 rounded bg-muted" />
                <div className="h-10 w-16 rounded bg-muted" />
              </div>
            </div>
          </CardContent>
        </Card>
        {children}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {user && (
        <Card>
          <CardContent className="pt-6">
            <HomepageProfile user={user} lng={lng} />
            <div className="mt-6">
              <HomepageActions lng={lng} />
            </div>
          </CardContent>
        </Card>
      )}

      {!user && (
        <Card>
          <CardContent className="p-4">
            <p className="text-muted-foreground mb-3 text-sm">
              {t("not_sign_in")}
            </p>
            <LinkWithLng href="/api/auth/signin">
              <Button className="w-full">{t("sign_in")}</Button>
            </LinkWithLng>
          </CardContent>
        </Card>
      )}

      {children}
    </div>
  );
};
