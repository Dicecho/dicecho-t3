"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RichTextPreview } from "@/components/Editor";
import { FeedbackReactions } from "./feedback-reactions";
import type { RouterOutputs } from "@/trpc/react";

type GithubComment = RouterOutputs["feedback"]["detail"]["comments"][number];

interface FeedbackCommentProps {
  comment: GithubComment;
}

export function FeedbackComment({ comment }: FeedbackCommentProps) {
  const timeAgo = getTimeAgo(comment.created_at);

  return (
    <Card className="border-l-4 border-l-muted">
      <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
        {comment.user && (
          <>
            <Avatar className="h-8 w-8">
              <AvatarImage src={comment.user.avatar_url} alt={comment.user.login} />
              <AvatarFallback>{comment.user.login[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <a
                href={comment.user.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold hover:text-primary hover:underline"
              >
                {comment.user.login}
              </a>
              <span className="text-muted-foreground">commented {timeAgo}</span>
            </div>
          </>
        )}
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        {comment.body && (
          <RichTextPreview
            markdown={comment.body}
            className="prose prose-sm dark:prose-invert max-w-none"
          />
        )}
        {comment.reactions && (
          <FeedbackReactions reactions={comment.reactions} />
        )}
      </CardContent>
    </Card>
  );
}

function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(months / 12);
  return `${years}y ago`;
}
