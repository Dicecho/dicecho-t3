"use client";

import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button, ButtonProps } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/react";
import { useNotifications } from "@/hooks/use-notifications";

export function MarkReadButton(props: ButtonProps) {
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation(lng);
  const {
    unreadCount,
    markAllRead,
    isMarkingAllRead,
  } = useNotifications();

  return (
    <Button
      onClick={() => markAllRead()}
      disabled={isMarkingAllRead || unreadCount === 0}
      {...props}
    >
      {isMarkingAllRead ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        t("notification_mark_all_read")
      )}
    </Button>
  );
}
