"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/react";
import type { INotificationDto } from "@/types/notification";
import { NotificationType } from "@/types/notification";

interface NotificationItemProps {
  notification: INotificationDto;
  onMarkRead?: (id: string) => void;
}

const eclipse = (text: string, length: number = 20) => {
  return `${text.slice(0, length)}${text.length > length ? "..." : ""}`;
};

export function NotificationItem({
  notification,
  onMarkRead,
}: NotificationItemProps) {
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation(lng);

  const renderVerb = () => {
    if (
      notification.type === NotificationType.Like &&
      "attitude" in notification.data &&
      notification.data.attitude === "happy"
    ) {
      return t("notification_type_attitude_happy");
    }

    const typeMap = {
      [NotificationType.Like]: t("notification_type_like"),
      [NotificationType.Follow]: t("notification_type_follow"),
      [NotificationType.Comment]: t("notification_type_comment"),
      [NotificationType.Reply]: t("notification_type_reply"),
    };

    return typeMap[notification.type];
  };

  const renderSuffix = () => {
    if (
      notification.type === NotificationType.Like &&
      "attitude" in notification.data &&
      notification.data.attitude === "happy"
    ) {
      return t("notification_suffix_happy");
    }

    return null;
  };

  const renderTarget = () => {
    if (notification.type === NotificationType.Like) {
      if (notification.data.targetName === "Rate") {
        return (
          <span>
            {t("notification_your_rate_in")}
            <Link
              href={`/${lng}/module/${notification.data.mod._id}`}
              className="mx-1 hover:underline"
            >
              {notification.data.mod.title}
            </Link>
            {t("notification_rate")}
            <Link
              href={`/${lng}/rate/${notification.data.targetId}`}
              className="hover:underline"
            >
              {eclipse(notification.data.content)}
            </Link>
          </span>
        );
      }

      if (notification.data.targetName === "Comment") {
        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              // TODO: Open comment dialog
              console.log("Open comment dialog:", notification.data.targetId);
            }}
            className="hover:underline"
          >
            {eclipse(notification.data.content)}
          </button>
        );
      }
    }

    if (notification.type === NotificationType.Comment) {
      const commentId = notification.data._id;

      if (notification.data.targetName === "Rate") {
        return (
          <span>
            {t("notification_your_rate_in")}
            <Link
              href={`/${lng}/module/${notification.data.mod._id}`}
              className="mx-1 hover:underline"
            >
              {notification.data.mod.title}
            </Link>
            {t("notification_rate")}
            <button
              onClick={(e) => {
                e.stopPropagation();
                // TODO: Open comment dialog
                console.log("Open comment dialog:", commentId);
              }}
              className="hover:underline"
            >
              {eclipse(notification.data.content)}
            </button>
          </span>
        );
      }

      if (notification.data.targetName === "Topic") {
        return (
          <span>
            {t("notification_your_topic")}
            <Link
              href={`/${lng}/forum/topic/${notification.data.targetId}`}
              className="mx-1 hover:underline"
            >
              {eclipse(notification.data.topic.title)}
            </Link>
            {t("notification_rate")}
            <button
              onClick={(e) => {
                e.stopPropagation();
                // TODO: Open comment dialog
                console.log("Open comment dialog:", commentId);
              }}
              className="hover:underline"
            >
              {eclipse(notification.data.content)}
            </button>
          </span>
        );
      }

      if (notification.data.targetName === "Collection") {
        return (
          <span>
            {t("notification_your_collection")}
            <Link
              href={`/${lng}/collection/${notification.data.targetId}`}
              className="mx-1 hover:underline"
            >
              {eclipse(notification.data.collection.title)}
            </Link>
            {t("notification_rate")}
            <button
              onClick={(e) => {
                e.stopPropagation();
                // TODO: Open comment dialog
                console.log("Open comment dialog:", commentId);
              }}
              className="hover:underline"
            >
              {eclipse(notification.data.content)}
            </button>
          </span>
        );
      }
    }

    if (notification.type === NotificationType.Reply) {
      const commentId = notification.data._id;
      return (
        <span>
          {t("notification_your_comment")}
          <button
            onClick={(e) => {
              e.stopPropagation();
              // TODO: Open comment dialog
              console.log("Open comment dialog:", commentId);
            }}
            className="hover:underline"
          >
            {eclipse(notification.data.content)}
          </button>
        </span>
      );
    }

    if (notification.type === NotificationType.Follow) {
      return null;
    }

    return null;
  };

  const handleClick = () => {
    if (notification.isUnread && onMarkRead) {
      onMarkRead(notification._id);
    }
  };

  return (
    <div
      className={cn(
        "relative flex gap-3 px-4 py-3 cursor-pointer hover:bg-accent/50 transition-colors",
        notification.isUnread && "bg-accent/30"
      )}
      onClick={handleClick}
    >
      {notification.isUnread && (
        <Badge
          variant="destructive"
          className="absolute left-2 top-3 h-2 w-2 p-0"
        />
      )}

      {notification.sender && (
        <Link
          href={`/${lng}/user/${notification.sender._id}`}
          onClick={(e) => e.stopPropagation()}
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={notification.sender.avatarUrl} />
            <AvatarFallback>
              {notification.sender.nickName.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
        </Link>
      )}

      <div className="flex-1 min-w-0">
        {notification.sender && (
          <Link
            href={`/${lng}/user/${notification.sender._id}`}
            onClick={(e) => e.stopPropagation()}
            className="font-medium hover:underline"
          >
            {notification.sender.nickName}
          </Link>
        )}
        <span className="mx-1 text-muted-foreground">{renderVerb()}</span>
        <span className="text-sm">{renderTarget()}</span>
        {renderSuffix() && (
          <span className="ml-1 text-sm">{renderSuffix()}</span>
        )}
      </div>
    </div>
  );
}
