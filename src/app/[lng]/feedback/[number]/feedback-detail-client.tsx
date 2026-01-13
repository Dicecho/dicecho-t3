"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CircleDot, CircleCheck, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MobileHeader } from "@/components/Header/MobileHeader";
import { useTranslation } from "@/lib/i18n/react";
import { FeedbackLabelBadge, FeedbackComment, FeedbackReactions } from "@/components/feedback";
import { CommentComposer } from "@/components/Comment";
import { RichTextPreview } from "@/components/Editor";
import { api, RouterOutputs } from "@/trpc/react";


interface FeedbackDetailClientProps {
  lng: string;
  issue: RouterOutputs['feedback']['detail']['issue'];
  comments: RouterOutputs['feedback']['detail']['comments'];
}

export function FeedbackDetailClient({
  lng,
  issue,
  comments,
}: FeedbackDetailClientProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [composerKey, setComposerKey] = useState(0);
  const isOpen = issue.state === "open";

  const createCommentMutation = api.feedback.createComment.useMutation({
    onSuccess: () => {
      toast.success(t("feedback_comment_submitted"));
      setComposerKey((prev) => prev + 1);
      router.refresh();
    },
    onError: (error) => {
      toast.error(t("error"), { description: error.message });
    },
  });

  const handleSubmitComment = async (content: string) => {
    await createCommentMutation.mutateAsync({
      issueNumber: issue.number,
      body: content,
    });
  };
  const Icon = isOpen ? CircleDot : CircleCheck;
  const iconColor = isOpen ? "text-green-600" : "text-purple-600";
  const statusBg = isOpen ? "bg-green-600" : "bg-purple-600";

  return (
    <>
      <MobileHeader
        left={
          <Link href={`/${lng}/feedback`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
        }
        right={
          <a href={issue.html_url} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon">
              <ExternalLink className="h-5 w-5" />
            </Button>
          </a>
        }
      >
        <span className="truncate">#{issue.number}</span>
      </MobileHeader>

      <div className="container pb-24 pt-4">
        <div className="mx-auto max-w-3xl space-y-6">
          {/* Header */}
          <div className="space-y-3">
            <h1 className="text-2xl font-bold">{issue.title}</h1>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium text-white ${statusBg}`}
              >
                <Icon className="h-4 w-4" />
                {isOpen ? t("feedback_open") : t("feedback_closed")}
              </span>
              <span className="text-sm text-muted-foreground">
                {issue.user && (
                  <a
                    href={issue.user.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold hover:text-primary hover:underline"
                  >
                    {issue.user.login}
                  </a>
                )}
                {" opened this issue on "}
                {new Date(issue.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {issue.labels
                .filter((label): label is Exclude<typeof label, string> => typeof label !== "string")
                .map((label) => (
                  <FeedbackLabelBadge key={label.name} label={label} />
                ))}
            </div>
          </div>

          {/* Issue body */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-3 space-y-0 border-b pb-3">
              {issue.user && (
                <>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={issue.user.avatar_url} alt={issue.user.login} />
                    <AvatarFallback>{issue.user.login[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <a
                      href={issue.user.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold hover:text-primary hover:underline"
                    >
                      {issue.user.login}
                    </a>
                    <p className="text-sm text-muted-foreground">
                      {new Date(issue.created_at).toLocaleString()}
                    </p>
                  </div>
                </>
              )}
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              {issue.body ? (
                <RichTextPreview
                  markdown={issue.body}
                  className="prose prose-sm dark:prose-invert max-w-none"
                />
              ) : (
                <p className="text-muted-foreground italic">
                  {t("feedback_no_description")}
                </p>
              )}
              {issue.reactions && (
                <FeedbackReactions reactions={issue.reactions} />
              )}
            </CardContent>
          </Card>

          {/* Comments */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">
              {t("feedback_comments")} ({comments.length})
            </h2>
            {comments.map((comment) => (
              <FeedbackComment key={comment.id} comment={comment} />
            ))}
          </div>

          {/* Add Comment */}
          {isOpen && (
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">{t("feedback_add_comment")}</h2>
              <CommentComposer
                key={composerKey}
                placeholder={t("feedback_comment_placeholder")}
                onSubmit={handleSubmitComment}
                mode="rich"
                disabled={createCommentMutation.isPending}
              />
            </div>
          )}

          {/* View on GitHub */}
          <div className="flex justify-center pt-4">
            <Button variant="outline" asChild>
              <a
                href={issue.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                {t("feedback_view_on_github")}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
