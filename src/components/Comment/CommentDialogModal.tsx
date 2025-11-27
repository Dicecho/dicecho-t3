"use client";

import { useQuery } from "@tanstack/react-query";
import { useDicecho } from "@/hooks/useDicecho";
import { useTranslation } from "@/lib/i18n/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ReplyItem } from "@/components/Comment/ReplyItem";
import type { ReplyDto } from "@/types/comment";
import { Loader2 } from "lucide-react";

interface CommentDialogModalProps {
  commentId?: string;
}

export const CommentDialogModal: React.FC<React.PropsWithChildren<CommentDialogModalProps>> = ({
  commentId,
  children,
}) => {
  const { api } = useDicecho();
  const { t } = useTranslation();

  const { data, isLoading, isError, refetch } = useQuery<ReplyDto[]>({
    queryKey: ["comment-dialog", commentId],
    queryFn: () => api.comment.dialog(commentId!),
    enabled: false,
  });

  return (
    <Dialog onOpenChange={(open) => {
      if (open) {
        refetch();
      }
    }}>
      <DialogTrigger>
        {children}
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto" showClose>
        <DialogHeader>
          <DialogTitle>{t("comment_dialog_title")}</DialogTitle>
        </DialogHeader>
        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            {t("loading")}
          </div>
        )}
        {isError && (
          <div className="text-sm text-destructive">
            {t("comment_load_failed")}
          </div>
        )}
        {!isLoading && !isError && (data?.length ?? 0) === 0 && (
          <div className="text-sm text-muted-foreground">
            {t("comment_dialog_empty")}
          </div>
        )}
        {!isLoading && !isError && (data?.length ?? 0) > 0 && (
          <div className="space-y-4">
            {data?.map((reply) => (
              <ReplyItem
                key={reply._id}
                reply={reply}
                onReply={() => {}}
                showActions={false}
              />
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

