"use client";

import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/hooks/use-notifications";
import { LinkWithLng } from "../Link";
import { Button } from "../ui/button";

export function NotificationReminder() {
  const { unreadCount } = useNotifications();

  return (
    <LinkWithLng href={`/account/notification`}>
      <Button variant="outline" size="icon" className="relative w-8 h-8 flex items-center justify-center rounded-full">
        <Bell size={16} className="text-muted-foreground" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full px-1 font-mono text-xs tabular-nums"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </Badge>
        )}
      </Button>
    </LinkWithLng>
  );
}
