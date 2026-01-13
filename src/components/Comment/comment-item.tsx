"use client";

import type { FC, PropsWithChildren } from "react";
import type { ParentCommentDto } from "@/types/comment";
import { useTranslation } from "@/lib/i18n/react";
import { Button } from "@/components/ui/button";
import { Popconfirm } from "@/components/ui/popconfirm";
import { CommentDisplay } from "./comment-display";

interface CommentItemProps {
  comment: ParentCommentDto;
  className?: string;
  onReply?: () => void;
  onDelete?: () => Promise<void>;
}

export const CommentItem: FC<PropsWithChildren<CommentItemProps>> = ({
  comment,
  className,
  onReply,
  onDelete,
  children,
}) => {
  const { t } = useTranslation();

  const user = comment.user ?? {
    nickName: "Dicecho User",
    avatarUrl: "",
  };

  const actions = (
    <>
      {onReply && (
        <Button variant="dim" size="sm" className="h-auto p-0 text-xs" onClick={onReply}>
          {t("comment_reply_button")}
        </Button>
      )}
      {comment.canEdit && onDelete && (
        <Popconfirm
          title={t("comment_delete_title")}
          description={t("comment_delete_desc")}
          confirmLabel={t("confirm")}
          cancelLabel={t("cancel")}
          onConfirm={onDelete}
        >
          <Button variant="dim" size="sm" className="h-auto p-0 text-xs hover:text-destructive">
            {t("comment_delete")}
          </Button>
        </Popconfirm>
      )}
    </>
  );

  return (
    <div className="border-border/60 border-b py-6 last:border-b-0">
      <CommentDisplay
        user={user}
        content={comment.content}
        createdAt={comment.createdAt}
        avatarSize="md"
        actions={actions}
        className={className}
      >
        {children}
      </CommentDisplay>
    </div>
  );
};
