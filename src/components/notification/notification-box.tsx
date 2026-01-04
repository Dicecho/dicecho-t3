"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Bell, MessageCircle, Heart, List } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/react";
import { NotificationItem } from "./notification-item";
import { useNotifications } from "@/hooks/use-notifications";
import { NotificationType } from "@/types/notification";
import { cn } from "@/lib/utils";

interface NotificationBoxProps {
  visible?: boolean;
  onClose?: () => void;
  className?: string;
}

export function NotificationBox({
  visible = true,
  onClose,
  className,
}: NotificationBoxProps) {
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation(lng);
  const [activeTab, setActiveTab] = useState("all");

  const notificationsNavigation = [
    {
      icon: List,
      value: "all",
      name: t("notification_all"),
    },
    {
      icon: MessageCircle,
      value: "comment",
      name: t("notification_comment"),
      type: NotificationType.Comment,
    },
    {
      icon: Heart,
      value: "like",
      name: t("notification_like"),
      type: NotificationType.Like,
    },
  ];

  const currentType = notificationsNavigation.find(
    (nav) => nav.value === activeTab,
  )?.type;

  const {
    notifications,
    unreadCount,
    isLoading,
    markRead,
    markAllRead,
    isMarkingAllRead,
  } = useNotifications({
    type: currentType,
    enabled: visible,
  });

  if (!visible) return null;

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex h-full items-center justify-center">
          <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2" />
        </div>
      );
    }

    if (notifications.length === 0) {
      return (
        <div className="text-muted-foreground flex h-full flex-col items-center justify-center">
          <Bell className="mb-4 h-12 w-12 opacity-30" />
          <p className="text-sm">{t("notification_empty")}</p>
        </div>
      );
    }

    return (
      <>
        {notifications.map((notification) => (
          <NotificationItem
            key={notification._id}
            notification={notification}
            onMarkRead={markRead}
          />
        ))}
      </>
    );
  };

  return (
    <div
      className={cn(
        "bg-background flex h-[400px] flex-col overflow-hidden rounded-lg border shadow-lg",
        className,
      )}
    >
      {/* Header */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex min-h-0 flex-1 flex-col">
        <TabsList className="w-full border-b bg-muted/50 flex h-12 justify-start gap-2 overflow-x-auto rounded-none border-0 p-0">
          {notificationsNavigation.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex-1 text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-foreground h-full rounded-none border-b-2 border-transparent px-4 py-2 text-xs font-semibold tracking-wide uppercase data-[state=active]:bg-transparent data-[state=active]:shadow-none max-md:flex-1"
              >
                <Icon className="mr-2 h-4 w-4" />
                {tab.name}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* Content */}
        {notificationsNavigation.map((tab) => (
          <TabsContent
            key={tab.value}
            value={tab.value}
            className="m-0 min-h-0 flex-1 overflow-y-auto px-4 data-[state=inactive]:hidden"
          >
            {renderContent()}
          </TabsContent>
        ))}
      </Tabs>

      {/* Footer */}
      <div className="bg-muted/50 flex shrink-0 items-center border-t px-2 py-1">
        <Button
          variant="link"
          size="sm"
          className="h-auto px-2 py-1 text-sm"
          onClick={() => markAllRead()}
          disabled={isMarkingAllRead || unreadCount === 0}
        >
          {t("notification_mark_all_read")}
        </Button>
        <Link href={`/${lng}/account/notification`} className="ml-auto">
          <Button variant="link" size="sm" className="h-auto px-2 py-1 text-sm">
            {t("notification_view_all")}
          </Button>
        </Link>
      </div>
    </div>
  );
}
