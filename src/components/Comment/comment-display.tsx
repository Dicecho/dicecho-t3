"use client";

import type { ReactNode } from "react";
import { UserAvatar } from "@/components/User/Avatar";
import { formatDateWithDistanceToNow } from "@/utils/time";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/react";
import { RichTextPreview } from "@/components/Editor";

type AvatarSize = "sm" | "md";

interface CommentDisplayProps {
  user: {
    nickName: string;
    avatarUrl?: string;
  };
  content: string;
  createdAt: string;
  /** "Reply to @xxx" - only shown if provided */
  replyToName?: string;
  /** Avatar size: sm (24px) or md (40px) */
  avatarSize?: AvatarSize;
  /** Action buttons (reply, delete, etc.) - rendered as-is */
  actions?: ReactNode;
  /** Nested content (e.g., reply list) */
  children?: ReactNode;
  className?: string;
}

const AVATAR_SIZES: Record<AvatarSize, string> = {
  sm: "h-6 w-6",
  md: "h-10 w-10",
};

export function CommentDisplay({
  user,
  content,
  createdAt,
  replyToName,
  avatarSize = "md",
  actions,
  children,
  className,
}: CommentDisplayProps) {
  const { t, i18n } = useTranslation();

  return (
    <div className={cn("flex gap-3", className)}>
      <UserAvatar
        className={cn("rounded-full", AVATAR_SIZES[avatarSize])}
        user={user}
      />
      <div className="min-w-0 flex-1 space-y-2">
        {/* Header: username, reply-to, timestamp */}
        <div className="flex flex-wrap items-baseline gap-2 text-sm">
          <span className="font-semibold">{user.nickName}</span>
          {replyToName && (
            <span className="text-muted-foreground text-xs">
              {t("comment_reply_to")}{" "}
              <span>@{replyToName}</span>
            </span>
          )}
          <span className="text-muted-foreground text-xs">
            {formatDateWithDistanceToNow(createdAt, i18n.language)}
          </span>
        </div>

        {/* Content */}
        <div className="text-sm leading-6 break-words whitespace-pre-wrap">
          <RichTextPreview markdown={content.trim()} />
        </div>

        {/* Actions */}
        {actions && (
          <div className="text-muted-foreground flex flex-wrap gap-3 text-xs">
            {actions}
          </div>
        )}

        {/* Nested content (replies, composer, etc.) */}
        {children}
      </div>
    </div>
  );
}
