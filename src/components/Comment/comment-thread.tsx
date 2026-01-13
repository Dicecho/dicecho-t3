"use client";

import type { ParentCommentDto, ReplyDto } from "@/types/comment";
import { useDicecho } from "@/hooks/useDicecho";
import { useTranslation } from "@/lib/i18n/react";
import { CommentItem } from "./comment-item";
import { CommentComposer } from "./comment-composer";
import { ReplySection, useInvalidateReplies } from "./reply-section";
import type { ReplyTarget } from "./reply-section";

interface CommentThreadProps {
  comment: ParentCommentDto;
  replyPageSize?: number;
  /** Called when user clicks reply on comment or any reply. If not provided, reply buttons won't show. */
  onReply?: (target: ReplyTarget) => void;
  /** Called after comment/reply is deleted to refresh parent */
  onRefresh?: () => Promise<void>;
  /** Current reply target for inline composer */
  replyTarget?: ReplyTarget | null;
  /** Called when inline reply is submitted */
  onReplySubmit?: (content: string) => Promise<void>;
  /** Called when inline reply is cancelled */
  onClearReply?: () => void;
}

export const CommentThread: React.FC<CommentThreadProps> = ({
  comment,
  replyPageSize = 10,
  onReply,
  onRefresh,
  replyTarget,
  onReplySubmit,
  onClearReply,
}) => {
  const { api } = useDicecho();
  const { t } = useTranslation();
  const invalidateReplies = useInvalidateReplies();

  const userName = comment.user?.nickName ?? "Dicecho User";
  const isReplyingToComment = replyTarget?.id === comment._id;

  const handleCommentReply = onReply
    ? () => {
        onReply({
          id: comment._id,
          name: userName,
          contentPreview: comment.content.split("\n")[0]?.slice(0, 100),
        });
      }
    : undefined;

  const handleCommentDelete = async () => {
    await api.comment.delete(comment._id);
    await onRefresh?.();
  };

  const handleReplyDelete = async (reply: ReplyDto) => {
    await api.comment.delete(reply._id);
    await invalidateReplies(comment._id);
    await onRefresh?.();
  };

  return (
    <CommentItem
      comment={comment}
      onReply={handleCommentReply}
      onDelete={handleCommentDelete}
    >
      {/* Show inline composer below comment if replying to this comment */}
      {isReplyingToComment && onReplySubmit && (
        <CommentComposer
          placeholder={t("comment_placeholder")}
          onSubmit={onReplySubmit}
          mode="simple"
          autoFocus
          onCancel={onClearReply}
          replyToName={replyTarget.name}
          replyToContent={replyTarget.contentPreview}
          className="mb-3"
        />
      )}
      <ReplySection
        commentId={comment._id}
        previewReplies={comment.replies ?? []}
        repliesCount={comment.repliesCount}
        pageSize={replyPageSize}
        onReply={onReply}
        onDelete={handleReplyDelete}
        replyTarget={replyTarget}
        onReplySubmit={onReplySubmit}
        onClearReply={onClearReply}
      />
    </CommentItem>
  );
};
