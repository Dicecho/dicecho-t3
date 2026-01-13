"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { PaginatedResponse } from "@dicecho/types";
import type { ReplyDto } from "@/types/comment";
import { useDicecho } from "@/hooks/useDicecho";
import { useTranslation } from "@/lib/i18n/react";
import { ControllablePagination } from "@/components/Pagination/ControllablePagination";
import { CommentComposer } from "./comment-composer";
import { ReplyItem, ReplyItemSkeleton } from "./reply-item";

const PREVIEW_COUNT = 3;

export interface ReplyTarget {
  id: string;
  name: string;
  /** First line of the content being replied to */
  contentPreview?: string;
}

interface ReplySectionProps {
  commentId: string;
  previewReplies: ReplyDto[];
  repliesCount: number;
  pageSize?: number;
  onReply?: (target: ReplyTarget) => void;
  onDelete?: (reply: ReplyDto) => Promise<void>;
  /** Current reply target for inline composer */
  replyTarget?: ReplyTarget | null;
  /** Called when inline reply is submitted */
  onReplySubmit?: (content: string) => Promise<void>;
  /** Called when inline reply is cancelled */
  onClearReply?: () => void;
}

export const ReplySection: React.FC<ReplySectionProps> = ({
  commentId,
  previewReplies,
  repliesCount,
  pageSize = 10,
  onReply,
  onDelete,
  replyTarget,
  onReplySubmit,
  onClearReply,
}) => {
  const { api } = useDicecho();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [isExpanded, setIsExpanded] = useState(false);
  const [page, setPage] = useState(1);

  // Only fetch replies after user clicks "view more"
  const { data, isFetching, isError } = useQuery<PaginatedResponse<ReplyDto>>({
    queryKey: ["comment-replies", commentId, pageSize, page],
    queryFn: () => api.comment.replies(commentId, { page, pageSize }),
    enabled: isExpanded,
    placeholderData: (previousData) => previousData,
    staleTime: 60_000,
  });

  const hasMoreThanPreview = repliesCount > PREVIEW_COUNT;
  const showViewMore = hasMoreThanPreview && !isExpanded;

  const repliesData = data ?? {
    totalCount: repliesCount,
    page,
    pageSize,
    data: [],
    hasNext: false,
  };
  const totalPages =
    repliesData.totalCount > 0
      ? Math.max(1, Math.ceil(repliesData.totalCount / pageSize))
      : 1;
  const showPagination = isExpanded && totalPages > 1;

  // Use preview replies before expanded, fetched replies after
  const fetchedReplies = repliesData.data ?? [];
  const replies =
    isExpanded && fetchedReplies.length > 0 ? fetchedReplies : previewReplies;

  // Show skeleton when expanded but data is still loading (first page only)
  const isInitialLoading = isExpanded && isFetching && fetchedReplies.length === 0;
  // Calculate additional skeleton count (replies beyond preview)
  const additionalSkeletonCount = Math.max(0, Math.min(pageSize, repliesCount) - PREVIEW_COUNT);

  const handleReplyClick = (reply: ReplyDto) => {
    onReply?.({
      id: reply._id,
      name: reply.user?.nickName ?? "Dicecho User",
      contentPreview: reply.content.split("\n")[0]?.slice(0, 100),
    });
  };

  if (replies.length === 0 && !showViewMore) {
    return null;
  }

  return (
    <div className="space-y-2">
      {replies.map((reply) => (
        <div key={reply._id}>
          <ReplyItem
            reply={reply}
            onReply={handleReplyClick}
            onDelete={onDelete}
          />
          {/* Show inline composer below this reply if it's the target */}
          {replyTarget?.id === reply._id && onReplySubmit && (
            <CommentComposer
              placeholder={t("comment_placeholder")}
              onSubmit={onReplySubmit}
              mode="simple"
              autoFocus
              onCancel={onClearReply}
              replyToName={replyTarget.name}
              replyToContent={replyTarget.contentPreview}
              className="mt-2 ml-9"
            />
          )}
        </div>
      ))}

      {/* Show skeleton for additional replies while loading */}
      {isInitialLoading &&
        Array.from({ length: additionalSkeletonCount }).map((_, i) => (
          <ReplyItemSkeleton key={`skeleton-${i}`} />
        ))}

      {showViewMore && (
        <button
          type="button"
          className="text-xs text-muted-foreground hover:text-foreground"
          onClick={() => setIsExpanded(true)}
          disabled={isFetching}
        >
          {t("comment_load_replies", { count: repliesCount })}
        </button>
      )}

      {showPagination && !isError && !isInitialLoading && (
        <ControllablePagination
          className="justify-start"
          current={page}
          onChange={setPage}
          total={totalPages}
          disabled={isFetching}
        />
      )}
    </div>
  );
};

// Helper to invalidate replies cache
export const useInvalidateReplies = () => {
  const queryClient = useQueryClient();
  return async (commentId: string) => {
    await queryClient.invalidateQueries({
      queryKey: ["comment-replies", commentId],
      exact: false,
    });
  };
};
