"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/react";
import { UserAvatar } from "@/components/User/Avatar";
import { CommentDialogModal } from "@/components/Comment";
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
              href={`/${lng}/scenario/${notification.data.mod._id}`}
              className="text-primary mx-1 hover:underline"
            >
              {notification.data.mod.title}
            </Link>
            {t("notification_rate")}
            <Link
              href={`/${lng}/rate/${notification.data.targetId}`}
              className="text-primary hover:underline"
            >
              {eclipse(notification.data.content)}
            </Link>
          </span>
        );
      }

      if (notification.data.targetName === "Comment") {
        return (
          <CommentDialogModal commentId={notification.data.targetId}>
            <span className="text-primary hover:underline">
              {eclipse(notification.data.content)}
            </span>
          </CommentDialogModal>
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
              href={`/${lng}/scenario/${notification.data.mod._id}`}
              className="text-primary mx-1 hover:underline"
            >
              {notification.data.mod.title}
            </Link>
            {t("notification_rate")}
            <CommentDialogModal commentId={commentId}>
              <span className="hover:underline">
                {eclipse(notification.data.content)}
              </span>
            </CommentDialogModal>
          </span>
        );
      }

      if (notification.data.targetName === "Topic") {
        return (
          <span>
            {t("notification_your_topic")}
            <Link
              href={`/${lng}/forum/topic/${notification.data.targetId}`}
              className="text-primary mx-1 hover:underline"
            >
              {eclipse(notification.data.topic.title)}
            </Link>
            {t("notification_rate")}
            <CommentDialogModal commentId={commentId}>
              <span className="text-primary hover:underline">
                {eclipse(notification.data.content)}
              </span>
            </CommentDialogModal>
          </span>
        );
      }

      if (notification.data.targetName === "Collection") {
        return (
          <span>
            {t("notification_your_collection")}
            <Link
              href={`/${lng}/collection/${notification.data.targetId}`}
              className="text-primary mx-1 hover:underline"
            >
              {eclipse(notification.data.collection.title)}
            </Link>
            {t("notification_rate")}
            <CommentDialogModal commentId={commentId}>
              <span className="text-primary hover:underline">
                {eclipse(notification.data.content)}
              </span>
            </CommentDialogModal>
          </span>
        );
      }
    }

    if (notification.type === NotificationType.Reply) {
      const commentId = notification.data._id;
      return (
        <span>
          {t("notification_your_comment")}
          <CommentDialogModal commentId={commentId}>
            <span className="text-primary hover:underline">
              {eclipse(notification.data.content)}
            </span>
          </CommentDialogModal>
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
        "flex cursor-pointer py-1 text-sm",
        "[&+&]:border-border [&+&]:border-t [&+&]:border-dashed",
      )}
      onClick={handleClick}
    >
      {notification.isUnread && (
        <span
          className="bg-destructive mt-1.5 mr-2 h-2 w-2 shrink-0 rounded-full"
          style={{ boxShadow: "0 0 5px rgba(223, 85, 78, 1)" }}
        />
      )}

      {notification.sender && (
        <Link
          href={`/${lng}/user/${notification.sender._id}`}
          onClick={(e) => e.stopPropagation()}
          className="mr-2 shrink-0"
        >
          <UserAvatar user={notification.sender} className="h-8 w-8" />
        </Link>
      )}

      <div className="min-w-0 flex-1">
        {notification.sender && (
          <Link
            href={`/${lng}/user/${notification.sender._id}`}
            onClick={(e) => e.stopPropagation()}
            className="mr-1 font-bold hover:underline"
          >
            {notification.sender.nickName}
          </Link>
        )}
        <span className="text-muted-foreground mx-1">{renderVerb()}</span>
        <span>{renderTarget()}</span>
        {renderSuffix() && <span className="ml-1">{renderSuffix()}</span>}
      </div>
    </div>
  );
}
