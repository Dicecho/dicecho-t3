"use client";

import { ReplyDto } from "@/types/comment";
import { UserAvatar } from "@/components/User/Avatar";
import { formatDate } from "@/utils/time";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useTranslation } from "@/lib/i18n/react";
import { CommentDialogModal } from "@/components/Comment/CommentDialogModal";

interface ReplyItemProps {
  reply: ReplyDto;
  onReply: (reply: ReplyDto) => void;
  onDelete?: (reply: ReplyDto) => Promise<void>;
  showActions?: boolean;
}

export const ReplyItem: React.FC<ReplyItemProps> = ({
  reply,
  onReply,
  onDelete,
  showActions = true,
}) => {
  const { t } = useTranslation();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const replyUser = reply.user ?? { nickName: "Dicecho User", avatarUrl: "" };
  const replyUserName = replyUser.nickName ?? "Dicecho User";
  const replyToUser = reply.replyTo?.user?.nickName;

  const handleDelete = async () => {
    if (!onDelete) {
      return;
    }
    await onDelete(reply);
    setConfirmOpen(false);
  };

  return (
    <div className="flex gap-2 rounded-2xl py-2">
      <UserAvatar
        className="h-6 w-6 rounded-full"
        user={replyUser}
      />
      <div className="flex-1 space-y-1">
        <div className="text-muted-foreground flex flex-wrap items-baseline gap-2 text-xs">
          <span className="text-foreground text-sm font-medium">
            {replyUserName}
          </span>
          {replyToUser && (
            <span>
              <span className="text-muted-foreground">
                {t("comment_reply_to")}
              </span>{" "}
              <span>@{replyToUser}</span>
            </span>
          )}
          <span>{formatDate(new Date(reply.createdAt).getTime())}</span>
        </div>
        <div className="text-sm text-foreground">{reply.content}</div>
        {showActions && (
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          <button
            type="button"
            className="hover:text-foreground"
            onClick={() => onReply(reply)}
          >
            {t("comment_reply_button")}
          </button>
          {reply.replyTo && (
            <CommentDialogModal commentId={reply._id}>
            <button
              type="button"
              className="hover:text-foreground"
            >
              {t("comment_view_dialog")}
            </button>
            </CommentDialogModal>
          )}
          {reply.canEdit && onDelete && (
            <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
              <AlertDialogTrigger asChild>
                <button type="button" className="hover:text-destructive">
                  {t("comment_delete")}
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {t("comment_delete_title")}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("comment_delete_desc")}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive hover:bg-destructive/90"
                    onClick={handleDelete}
                  >
                    {t("confirm")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
        )}
      </div>
    </div>
  );
};

