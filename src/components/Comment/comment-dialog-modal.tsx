"use client";

import { useState, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useDicecho } from "@/hooks/useDicecho";
import { useTranslation } from "@/lib/i18n/react";
import { toast } from "sonner";
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
  ResponsiveModalTrigger,
} from "@/components/ui/responsive-modal";
import { Button } from "@/components/ui/button";
import { Popconfirm } from "@/components/ui/popconfirm";
import { Skeleton } from "@/components/ui/skeleton";
import { CommentDisplay } from "./comment-display";
import { CommentComposer } from "./comment-composer";
import type { ReplyDto } from "@/types/comment";

interface CommentDialogModalProps {
  commentId?: string;
}

interface ReplyTarget {
  id: string;
  name: string;
  contentPreview?: string;
}

function DialogItemSkeleton() {
  return (
    <div className="flex gap-3 py-3">
      <Skeleton className="h-6 w-6 shrink-0 rounded-full" />
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex items-baseline gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}

export const CommentDialogModal: React.FC<React.PropsWithChildren<CommentDialogModalProps>> = ({
  commentId,
  children,
}) => {
  const { api } = useDicecho();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [replyTarget, setReplyTarget] = useState<ReplyTarget | null>(null);

  const { data, isLoading, isError, refetch } = useQuery<ReplyDto[]>({
    queryKey: ["comment-dialog", commentId],
    queryFn: () => api.comment.dialog(commentId!),
    enabled: false,
  });

  const handleOpenChange = useCallback((newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      refetch();
    } else {
      setReplyTarget(null);
    }
  }, [refetch]);

  const invalidateDialog = useCallback(async () => {
    await queryClient.invalidateQueries({
      queryKey: ["comment-dialog", commentId],
    });
  }, [queryClient, commentId]);

  const handleReply = useCallback((reply: ReplyDto) => {
    const user = reply.user ?? { nickName: "User" };
    setReplyTarget({
      id: reply._id,
      name: user.nickName,
      contentPreview: reply.content.slice(0, 50),
    });
  }, []);

  const handleReplySubmit = useCallback(async (content: string) => {
    if (!replyTarget) return;
    await api.comment.reply(replyTarget.id, { content });
    await invalidateDialog();
    setReplyTarget(null);
    toast.success(t("comment_submit"));
  }, [api, replyTarget, invalidateDialog, t]);

  const handleDelete = useCallback(async (reply: ReplyDto) => {
    await api.comment.delete(reply._id);
    await invalidateDialog();
    toast.success(t("comment_deleted"));
  }, [api, invalidateDialog, t]);

  return (
    <ResponsiveModal open={open} onOpenChange={handleOpenChange}>
      <ResponsiveModalTrigger asChild>
        {children}
      </ResponsiveModalTrigger>
      <ResponsiveModalContent showCloseButton>
        <ResponsiveModalHeader>
          <ResponsiveModalTitle>{t("comment_dialog_title")}</ResponsiveModalTitle>
        </ResponsiveModalHeader>

        <div className="flex-1 overflow-y-auto px-4 pb-4 md:px-0">
          {/* Loading skeleton */}
          {isLoading && (
            <div className="space-y-2">
              <DialogItemSkeleton />
              <DialogItemSkeleton />
              <DialogItemSkeleton />
            </div>
          )}

          {/* Error state */}
          {isError && (
            <div className="py-4 text-center text-sm text-destructive">
              {t("comment_load_failed")}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !isError && (data?.length ?? 0) === 0 && (
            <div className="py-4 text-center text-sm text-muted-foreground">
              {t("comment_dialog_empty")}
            </div>
          )}

          {/* Content */}
          {!isLoading && !isError && (data?.length ?? 0) > 0 && (
            <div className="space-y-1">
              {data?.map((reply) => {
                const user = reply.user ?? { nickName: "User", avatarUrl: "" };
                const actions = (
                  <>
                    <Button
                      variant="dim"
                      size="sm"
                      className="h-auto p-0 text-xs"
                      onClick={() => handleReply(reply)}
                    >
                      {t("comment_reply_button")}
                    </Button>
                    {reply.canEdit && (
                      <Popconfirm
                        title={t("comment_delete_title")}
                        description={t("comment_delete_desc")}
                        confirmLabel={t("confirm")}
                        cancelLabel={t("cancel")}
                        onConfirm={() => handleDelete(reply)}
                      >
                        <Button
                          variant="dim"
                          size="sm"
                          className="h-auto p-0 text-xs hover:text-destructive"
                        >
                          {t("comment_delete")}
                        </Button>
                      </Popconfirm>
                    )}
                  </>
                );

                return (
                  <div key={reply._id}>
                    <CommentDisplay
                      user={user}
                      content={reply.content}
                      createdAt={reply.createdAt}
                      replyToName={reply.replyTo?.user?.nickName}
                      avatarSize="sm"
                      actions={actions}
                      className="py-3"
                    />
                    {/* Inline reply composer */}
                    {replyTarget?.id === reply._id && (
                      <div className="mb-2 ml-9">
                        <CommentComposer
                          placeholder={t("comment_placeholder")}
                          onSubmit={handleReplySubmit}
                          replyToName={replyTarget.name}
                          replyToContent={replyTarget.contentPreview}
                          onCancel={() => setReplyTarget(null)}
                          autoFocus
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
};
