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

  const currentType =
    notificationsNavigation.find((nav) => nav.value === activeTab)?.type;

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
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      );
    }

    if (notifications.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <Bell className="h-12 w-12 mb-4 opacity-30" />
          <p>{t("notification_empty")}</p>
        </div>
      );
    }

    return (
      <div className="divide-y">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification._id}
            notification={notification}
            onMarkRead={markRead}
          />
        ))}
      </div>
    );
  };

  return (
    <div
      className={cn(
        "flex flex-col bg-background border rounded-lg shadow-lg overflow-hidden",
        className
      )}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsList className="w-full justify-start rounded-none border-b bg-muted/50">
          {notificationsNavigation.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center gap-2"
              >
                <Icon className="h-4 w-4" />
                {tab.name}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {notificationsNavigation.map((tab) => (
          <TabsContent
            key={tab.value}
            value={tab.value}
            className="m-0 max-h-[400px] overflow-y-auto"
          >
            {renderContent()}
          </TabsContent>
        ))}
      </Tabs>

      <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/30">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => markAllRead()}
          disabled={isMarkingAllRead || unreadCount === 0}
        >
          {t("notification_mark_all_read")}
        </Button>
        <Link href={`/${lng}/account/notification`}>
          <Button variant="ghost" size="sm">
            {t("notification_view_all")}
          </Button>
        </Link>
      </div>
    </div>
  );
}
