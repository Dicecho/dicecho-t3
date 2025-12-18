"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Bell, MessageCircle, Heart, List, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/react";
import { NotificationItem } from "@/components/notification/notification-item";
import { useInfiniteNotifications } from "@/hooks/use-notifications";
import { NotificationType } from "@/types/notification";
import { useInView } from "react-intersection-observer";
import { useSession } from "next-auth/react";

const NOTIFICATIONS_NAVIGATION = [
  {
    icon: List,
    value: "all",
    translationKey: "notification_all",
    type: undefined,
  },
  {
    icon: MessageCircle,
    value: "comment",
    translationKey: "notification_comment",
    type: NotificationType.Comment,
  },
  {
    icon: Heart,
    value: "like",
    translationKey: "notification_like",
    type: NotificationType.Like,
  },
] as const;

export function NotificationPageContent() {
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation(lng);
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;
  const [activeTab, setActiveTab] = useState("all");
  const { ref, inView } = useInView();

  const currentType = NOTIFICATIONS_NAVIGATION.find(
    (nav) => nav.value === activeTab,
  )?.type;

  const {
    notifications,
    unreadCount,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    markRead,
    markAllRead,
    isMarkingAllRead,
  } = useInfiniteNotifications({
    type: currentType,
    pageSize: 20,
    enabled: true,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage().catch(console.error);
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
        </div>
      );
    }

    if (notifications.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
          <Bell className="h-16 w-16 mb-4 opacity-30" />
          <p className="text-lg">{t("notification_empty")}</p>
        </div>
      );
    }

    return (
      <>
        <div className="divide-y">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification._id}
              notification={notification}
              onMarkRead={markRead}
            />
          ))}
        </div>
        {hasNextPage && (
          <div ref={ref} className="flex items-center justify-center py-8">
            {isFetchingNextPage && (
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            )}
          </div>
        )}
      </>
    );
  };

  if (!isAuthenticated) {
    return <div>Please sign in to view your notifications.</div>;
  }

  return (
    <>
      <div className="sticky top-16 md:top-16 z-10 border-b border-border/60 bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/70">
        <div className="container">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="flex h-12 w-full justify-start gap-2 overflow-x-auto rounded-none border-0 bg-transparent p-0">
              {NOTIFICATIONS_NAVIGATION.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="max-md:flex-1 h-full rounded-none border-b-2 border-transparent px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {t(tab.translationKey)}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Content */}
      <div className="container pb-16">
        {renderContent()}
      </div>
    </>
  );
}
