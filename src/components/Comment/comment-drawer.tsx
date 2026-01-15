"use client";

import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useDicecho } from "@/hooks/useDicecho";
import { useTranslation } from "@/lib/i18n/react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { CommentSection, type ReplyTarget } from "./comment-section";
import { MobileCommentFooter } from "./mobile-comment-footer";
import { useInvalidateReplies } from "./reply-section";

interface CommentDrawerProps {
  targetName: string;
  targetId: string;
  initialCount?: number;
  children: React.ReactNode;
}

export function CommentDrawer({
  targetName,
  targetId,
  initialCount = 0,
  children,
}: CommentDrawerProps) {
  const { api } = useDicecho();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const invalidateReplies = useInvalidateReplies();

  const [open, setOpen] = useState(false);
  const [replyTarget, setReplyTarget] = useState<ReplyTarget | null>(null);

  // Clear reply target when drawer closes
  useEffect(() => {
    if (!open) {
      setReplyTarget(null);
    }
  }, [open]);

  const invalidateComments = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["comments", targetName, targetId],
      exact: false,
    });
  };

  const handleReply = (target: ReplyTarget) => {
    setReplyTarget(target);
  };

  const handleSubmit = async (content: string) => {
    if (replyTarget) {
      await api.comment.reply(replyTarget.id, { content });
      await invalidateReplies(replyTarget.id);
      await invalidateComments();
    } else {
      await api.comment.create(targetName, targetId, { content });
      await invalidateComments();
    }
  };

  const handleClearReply = () => {
    setReplyTarget(null);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="flex max-h-[85vh] flex-col">
        {/* Drag handle */}
        <div className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-muted" />

        <DrawerHeader className="shrink-0 pb-2">
          <DrawerTitle>
            {initialCount > 0 ? `${initialCount} ` : ""}
            {t("comments")}
          </DrawerTitle>
        </DrawerHeader>

        {/* Scrollable comment list */}
        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
          <CommentSection
            targetName={targetName}
            targetId={targetId}
            onReply={handleReply}
            showComposer={false}
          />
        </div>

        {/* Footer - relative position inside drawer */}
        <MobileCommentFooter
          variant="relative"
          onSubmit={handleSubmit}
          replyTargetId={replyTarget?.id}
          replyToName={replyTarget?.name}
          replyToContent={replyTarget?.contentPreview}
          onClearReply={handleClearReply}
        />
      </DrawerContent>
    </Drawer>
  );
}
