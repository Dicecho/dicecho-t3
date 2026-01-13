"use client";

import type { ReplyDto } from "@/types/comment";
import { useTranslation } from "@/lib/i18n/react";
import { Button } from "@/components/ui/button";
import { Popconfirm } from "@/components/ui/popconfirm";
import { Skeleton } from "@/components/ui/skeleton";
import { CommentDisplay } from "./comment-display";
import { CommentDialogModal } from "./comment-dialog-modal";

interface ReplyItemProps {
  reply: ReplyDto;
  onReply?: (reply: ReplyDto) => void;
  onDelete?: (reply: ReplyDto) => Promise<void>;
}

export const ReplyItem: React.FC<ReplyItemProps> = ({
  reply,
  onReply,
  onDelete,
}) => {
  const { t } = useTranslation();
  const replyToName = reply.replyTo?.user?.nickName;

  const actions = (
    <>
      {onReply && (
        <Button
          variant="dim"
          size="sm"
          className="h-auto p-0 text-xs"
          onClick={() => onReply(reply)}
        >
          {t("comment_reply_button")}
        </Button>
      )}
      {reply.replyTo && (
        <CommentDialogModal commentId={reply._id}>
          <Button variant="dim" size="sm" className="h-auto p-0 text-xs">
            {t("comment_view_dialog")}
          </Button>
        </CommentDialogModal>
      )}
      {reply.canEdit && onDelete && (
        <Popconfirm
          title={t("comment_delete_title")}
          description={t("comment_delete_desc")}
          confirmLabel={t("confirm")}
          cancelLabel={t("cancel")}
          onConfirm={() => onDelete(reply)}
        >
          <Button variant="dim" size="sm" className="h-auto p-0 text-xs hover:text-destructive">
            {t("comment_delete")}
          </Button>
        </Popconfirm>
      )}
    </>
  );

  return (
    <CommentDisplay
      user={reply.user}
      content={reply.content}
      createdAt={reply.createdAt}
      replyToName={replyToName}
      avatarSize="sm"
      actions={actions}
      className="py-2"
    />
  );
};

export function ReplyItemSkeleton() {
  return (
    <div className="flex gap-3 py-2">
      <Skeleton className="h-6 w-6 rounded-full" />
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex items-baseline gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}
