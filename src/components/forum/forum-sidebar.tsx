"use client";

import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/react";
import { useSession } from "next-auth/react";
import { PenSquare } from "lucide-react";
import { LinkWithLng } from "@/components/Link";
import { HomepageProfile } from "@/components/Home/HomepageProfile";
import { TopicFormDialog } from "./topic-form-dialog";
import type { PropsWithChildren } from "react";

interface ForumSidebarProps {}

export function ForumSidebar({ children }: PropsWithChildren<ForumSidebarProps>) {
  const { t } = useTranslation();
  const params = useParams();
  const lng = (params.lng as string) || "en";
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div className="flex flex-col gap-4">
      {user && (
        <Card>
          <CardContent className="pt-6">
            <HomepageProfile user={user} lng={lng} />
            <TopicFormDialog>
              <Button className="mt-6 w-full">
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
