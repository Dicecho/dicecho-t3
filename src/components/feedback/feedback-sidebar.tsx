"use client";

import { useSession } from "next-auth/react";
import { ExternalLink, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/lib/i18n/react";
import { FeedbackFormDialog } from "./feedback-form-dialog";
import { env } from "@/env";

export function FeedbackSidebar() {
  const { t } = useTranslation();
  const { data: session } = useSession();

  const githubRepoUrl = `https://github.com/${env.NEXT_PUBLIC_DICECHO_API_ENDPOINT ? "dicecho" : "dicecho"}/feedback`;

  return (
    <div className="sticky top-20 space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t("feedback_about")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>{t("feedback_about_description")}</p>
          <div className="flex flex-col gap-2">
            {session?.user ? (
              <FeedbackFormDialog>
                <Button className="w-full gap-2">
                  <Plus className="h-4 w-4" />
                  {t("feedback_submit")}
                </Button>
              </FeedbackFormDialog>
            ) : (
              <p className="text-center text-sm">{t("feedback_login_required")}</p>
            )}
            <Button variant="outline" className="w-full gap-2" asChild>
              <a
                href="https://github.com/dicecho/feedback"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4" />
                {t("feedback_view_on_github")}
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
