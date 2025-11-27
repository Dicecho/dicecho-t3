"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { ParentCommentDto, ReplyDto } from "@/types/comment";
import { useDicecho } from "@/hooks/useDicecho";
import { useTranslation } from "@/lib/i18n/react";
import { UserAvatar } from "@/components/User/Avatar";
import { formatDate } from "@/utils/time";
import { cn } from "@/lib/utils";
import { ControllablePagination } from "@/components/Pagination/ControllablePagination";
import type { PaginatedResponse } from "@dicecho/types";
import { CommentComposer } from "@/components/Comment/CommentComposer";
import { ReplyItem } from "@/components/Comment/ReplyItem";
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
import { RichTextPreview } from "../Editor";

interface CommentItemProps {
  comment: ParentCommentDto;
  className?: string;
  replyPageSize?: number;
  onRefresh?: () => Promise<void>;
}

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  className,
  replyPageSize = 10,
  onRefresh,
}) => {
  const { api } = useDicecho();
  const { t } = useTranslation();
  const [replyPage, setReplyPage] = useState(1);
  const [replyTarget, setReplyTarget] = useState<{ id: string; name: string } | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const queryClient = useQueryClient();

  const commentUserName = comment.user?.nickName ?? "Dicecho User";
  const commentUser = comment.user ?? {
    nickName: commentUserName,
    avatarUrl: "",
  };
  const {
    data: repliesData,
    isFetching,
    isError,
  } = useQuery<PaginatedResponse<ReplyDto>>({
    queryKey: ["comment-replies", comment._id, replyPageSize, replyPage],
    queryFn: () =>
      api.comment.replies(comment._id, {
        page: replyPage,
        pageSize: replyPageSize,
      }),
    initialData: {
      totalCount: comment.repliesCount,
      page: replyPage,
      pageSize: replyPageSize,
      data: comment.replies ?? [],
      hasNext: comment.repliesCount > replyPageSize,
    },
    placeholderData: (previousData) => previousData,
    staleTime: 60_000,
  });
  const totalPages =
    repliesData.totalCount > 0
      ? Math.max(1, Math.ceil(repliesData.totalCount / replyPageSize))
      : 1;
  const showPagination = totalPages > 1;
  const replies = repliesData.data ?? [];

  const invalidateReplies = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["comment-replies", comment._id],
      exact: false,
    });
  };

  const handleReplySubmit = async (content: string) => {
    if (!replyTarget) return;
    await api.comment.reply(replyTarget.id, { content });
    setReplyTarget(null);
    setReplyPage(1);
    await invalidateReplies();
    await onRefresh?.();
  };

  const handleReplyDelete = async (reply: ReplyDto) => {
    await api.comment.delete(reply._id);
    await invalidateReplies();
    await onRefresh?.();
  };

  const handleCommentDelete = async () => {
    await api.comment.delete(comment._id);
    setDeleteOpen(false);
    await onRefresh?.();
  };

  return (
    <div
      className={cn(
        "border-border/60 border-b py-6 last:border-b-0",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <UserAvatar
          className="h-10 w-10 rounded-full"
          user={commentUser}
          alt="comment avatar"
          width={40}
          height={40}
        />
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="font-semibold">{commentUserName}</span>
            <span className="text-muted-foreground text-xs">
              {formatDate(new Date(comment.createdAt).getTime())}
            </span>
          </div>
          <p className="text-foreground text-sm leading-6 whitespace-pre-wrap">
            <RichTextPreview markdown={comment.content.trim()} />
          </p>
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            <button
              type="button"
              className="hover:text-foreground"
              onClick={() =>
                setReplyTarget({ id: comment._id, name: commentUserName })
              }
            >
              {t("comment_reply_button")}
            </button>
            {comment.canEdit && (
              <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogTrigger asChild>
                  <button type="button" className="hover:text-destructive">
                    {t("comment_delete")}
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t("comment_delete_title")}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {t("comment_delete_desc")}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive hover:bg-destructive/90"
                      onClick={handleCommentDelete}
                    >
                      {t("confirm")}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>

          {repliesData.totalCount > 0 && (
            <div className="space-y-2">
              {replies.map((reply) => (
                <ReplyItem
                  key={reply._id}
                  reply={reply}
                  onReply={(target) =>
                    setReplyTarget({
                      id: target._id,
                      name: target.user?.nickName ?? "Dicecho User",
                    })
                  }
                  onDelete={handleReplyDelete}
                />
              ))}

              {showPagination && !isError && (
                <ControllablePagination
                  className="justify-start"
                  current={replyPage}
                  onChange={(page) => setReplyPage(page)}
                  total={totalPages}
                  disabled={isFetching}
                />
              )}
            </div>
          )}

          {replyTarget && (
            <CommentComposer
              placeholder={t("comment_reply_placeholder", {
                name: replyTarget.name,
              })}
              onSubmit={handleReplySubmit}
              showCancel
              cancelLabel={t("cancel")}
              onCancel={() => setReplyTarget(null)}
              autoFocus
            />
          )}
        </div>
      </div>
    </div>
  );
};
