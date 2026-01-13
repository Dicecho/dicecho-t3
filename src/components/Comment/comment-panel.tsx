"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useDicecho } from "@/hooks/useDicecho";
import { useTranslation } from "@/lib/i18n/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CommentSection, type ReplyTarget } from "./comment-section";
import { MobileCommentFooter } from "./mobile-comment-footer";
import { useInvalidateReplies } from "./reply-section";

const COMMENT_SORT_OPTIONS = [
  { key: "created", labelKey: "comment_sort_oldest", value: { createdAt: 1 } },
  { key: "-created", labelKey: "comment_sort_newest", value: { createdAt: -1 } },
  { key: "like", labelKey: "comment_sort_likes", value: { likeCount: -1 } },
] as const;

interface CommentPanelProps {
  targetName: string;
  targetId: string;
  initialCount?: number;
}

export function CommentPanel({
  targetName,
  targetId,
  initialCount = 0,
}: CommentPanelProps) {
  const { api } = useDicecho();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const invalidateReplies = useInvalidateReplies();

  const [commentSort, setCommentSort] = useState("created");
  const [commentCount, setCommentCount] = useState(initialCount);
  const [replyTarget, setReplyTarget] = useState<ReplyTarget | null>(null);

  const currentSortOption =
    COMMENT_SORT_OPTIONS.find((opt) => opt.key === commentSort) ??
    COMMENT_SORT_OPTIONS[0];

  const invalidateComments = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["comments", targetName, targetId],
      exact: false,
    });
  };

  const handleReply = (target: ReplyTarget) => {
    setReplyTarget(target);
  };

  const handleMobileSubmit = async (content: string) => {
    if (replyTarget) {
      await api.comment.reply(replyTarget.id, { content });
      await invalidateReplies(replyTarget.id);
      await invalidateComments();
    } else {
      await api.comment.create(targetName, targetId, { content });
      await invalidateComments();
      setCommentCount((prev) => prev + 1);
    }
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <span className="font-medium">
          {commentCount} {t("comments")}
        </span>
        <Select value={commentSort} onValueChange={setCommentSort}>
          <SelectTrigger className="w-auto border-0 bg-transparent">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {COMMENT_SORT_OPTIONS.map((option) => (
              <SelectItem key={option.key} value={option.key}>
                {t(option.labelKey)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Desktop: with top-level composer and inline reply */}
      <div className="hidden md:block">
        <CommentSection
          targetName={targetName}
          targetId={targetId}
          sort={currentSortOption.value}
          onReply={handleReply}
          showComposer
          replyTarget={replyTarget}
          onReplySubmit={async (content) => {
            if (replyTarget) {
              await api.comment.reply(replyTarget.id, { content });
              await invalidateReplies(replyTarget.id);
              await invalidateComments();
              setReplyTarget(null);
            }
          }}
          onClearReply={() => setReplyTarget(null)}
        />
      </div>

      {/* Mobile: no top-level composer, use bottom footer instead */}
      <div className="md:hidden">
        <CommentSection
          targetName={targetName}
          targetId={targetId}
          sort={currentSortOption.value}
          onReply={handleReply}
          showComposer={false}
        />
      </div>

      <MobileCommentFooter
        onSubmit={handleMobileSubmit}
        replyToName={replyTarget?.name}
        replyToContent={replyTarget?.contentPreview}
        onClearReply={() => setReplyTarget(null)}
      />
    </>
  );
}
