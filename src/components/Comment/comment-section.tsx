"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useDicecho } from "@/hooks/useDicecho";
import { useTranslation } from "@/lib/i18n/react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CommentThread } from "./comment-thread";
import { CommentComposer } from "./comment-composer";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ControllablePagination } from "@/components/Pagination/ControllablePagination";
import type { PaginatedResponse } from "@dicecho/types";
import type { ParentCommentDto } from "@/types/comment";
import type { ReplyTarget } from "./reply-section";

interface CommentSectionProps {
  targetName: string;
  targetId: string;
  pageSize?: number;
  className?: string;
  sort?: Record<string, number>;
  /** Called when user clicks reply - parent decides how to handle */
  onReply: (target: ReplyTarget) => void;
  /** Show top-level comment composer (default: true) */
  showComposer?: boolean;
  /** Current reply target for inline composer (PC only) */
  replyTarget?: ReplyTarget | null;
  /** Called when inline reply is submitted */
  onReplySubmit?: (content: string) => Promise<void>;
  /** Called when inline reply is cancelled */
  onClearReply?: () => void;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  targetName,
  targetId,
  pageSize = 10,
  className,
  sort,
  onReply,
  showComposer = true,
  replyTarget,
  onReplySubmit,
  onClearReply,
}) => {
  const { api, initialized } = useDicecho();
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  useEffect(() => {
    setPage(1);
  }, [targetId, targetName, pageSize, sort]);

  const {
    data,
    isPending,
    isFetching,
    error,
    refetch,
  } = useQuery<PaginatedResponse<ParentCommentDto>>({
    queryKey: ["comments", targetName, targetId, pageSize, page, sort],
    queryFn: () =>
      api.comment.list(targetName, targetId, {
        page,
        pageSize,
        sort,
      }),
    enabled: initialized && Boolean(targetId) && Boolean(targetName),
    placeholderData: (previousData) => previousData,
    staleTime: 60_000,
  });

  const comments = data?.data ?? [];
  const totalCount = data?.totalCount ?? 0;
  const totalPages =
    totalCount > 0 ? Math.max(1, Math.ceil(totalCount / pageSize)) : 1;
  const showPagination = totalCount > pageSize;
  const placeholder = useMemo(
    () =>
      comments.length === 0
        ? t("comment_placeholder_first")
        : t("comment_placeholder"),
    [comments.length, t],
  );

  const handleTopLevelSubmit = async (payload: string) => {
    await api.comment.create(targetName, targetId, { content: payload });
    setPage(1);
    await invalidateComments();
  };

  const invalidateComments = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["comments", targetName, targetId],
      exact: false,
    });
  };

  return (
    <div className={cn("space-y-4", className)}>
      {showComposer && (
        <CommentComposer
          placeholder={placeholder}
          onSubmit={handleTopLevelSubmit}
          mode="rich"
        />
      )}

      {isPending && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-24 w-full" />
          ))}
        </div>
      )}

      {!isPending && error && (
        <div className="space-y-2">
          <div className="text-sm text-destructive">
            {t("comment_load_failed")}
          </div>
          <Button
            size="sm"
            variant="outline"
            className="w-fit"
            onClick={() => refetch()}
          >
            {t("retry")}
          </Button>
        </div>
      )}

      {!isPending && !error && comments.length === 0 && (
        <div className="text-sm text-muted-foreground">{t("comment_empty")}</div>
      )}

      {!error && comments.length > 0 && (
        <div className="space-y-4">
          {comments.map((comment: ParentCommentDto) => (
            <CommentThread
              key={comment._id}
              comment={comment}
              onReply={onReply}
              onRefresh={invalidateComments}
              replyTarget={replyTarget}
              onReplySubmit={onReplySubmit}
              onClearReply={onClearReply}
            />
          ))}
        </div>
      )}

      {showPagination && !error && (
        <div className="flex flex-col items-center gap-2 pt-2">
          {isFetching && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              {t("loading")}
            </div>
          )}
          <ControllablePagination
            current={page}
            onChange={setPage}
            total={totalPages}
            disabled={isFetching}
          />
        </div>
      )}
    </div>
  );
};

// Re-export types for convenience
export type { ReplyTarget };
