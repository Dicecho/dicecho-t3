"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/User/Avatar";
import { useTranslation } from "@/lib/i18n/react";
import { useSession } from "next-auth/react";
import { PenSquare } from "lucide-react";
import { LinkWithLng } from "@/components/Link";
import { TopicFormDialog } from "./topic-form-dialog";
import type { PropsWithChildren } from "react";

interface ForumSidebarProps {}

export function ForumSidebar({ children }: PropsWithChildren<ForumSidebarProps>) {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div className="flex flex-col gap-4">
      {user && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <UserAvatar
                user={{ avatarUrl: user.avatarUrl ?? "", nickName: user.nickName ?? "" }}
                className="h-12 w-12"
              />
              <div className="flex-1 overflow-hidden">
                <LinkWithLng href={`/account/${user._id}`}>
                  <div className="truncate font-medium hover:underline">
                    {user.nickName}
                  </div>
                </LinkWithLng>
              </div>
            </div>
            <TopicFormDialog>
              <Button className="mt-4 w-full">
                <PenSquare className="mr-2 h-4 w-4" />
                {t("topic_create")}
              </Button>
            </TopicFormDialog>
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
}
