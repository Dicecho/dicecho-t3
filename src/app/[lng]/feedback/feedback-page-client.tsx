"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useTranslation } from "@/lib/i18n/react";
import {
  FeedbackList,
  FeedbackSidebar,
  FeedbackFormDialog,
} from "@/components/feedback";

interface FeedbackPageClientProps {
  lng: string;
}

export function FeedbackPageClient({ lng }: FeedbackPageClientProps) {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const [state, setState] = useState<"open" | "closed" | "all">("open");

  return (
    <div className="grid grid-cols-6 gap-8">
      <div className="col-span-6 md:col-span-4">
        <Tabs value={state} onValueChange={(v) => setState(v as typeof state)}>
          <div className="mb-4 flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="open">{t("feedback_open")}</TabsTrigger>
              <TabsTrigger value="closed">{t("feedback_closed")}</TabsTrigger>
              <TabsTrigger value="all">{t("feedback_all")}</TabsTrigger>
            </TabsList>
            {session?.user && (
              <FeedbackFormDialog>
                <Button size="sm" className="gap-1 md:hidden">
                  <Plus className="h-4 w-4" />
                  {t("feedback_new")}
                </Button>
              </FeedbackFormDialog>
            )}
          </div>

          <TabsContent value="open" className="mt-0">
            <FeedbackList state="open" />
          </TabsContent>
          <TabsContent value="closed" className="mt-0">
            <FeedbackList state="closed" />
          </TabsContent>
          <TabsContent value="all" className="mt-0">
            <FeedbackList state="all" />
          </TabsContent>
        </Tabs>
      </div>

      <div className="hidden md:col-span-2 md:block">
        <FeedbackSidebar />
      </div>
    </div>
  );
}
