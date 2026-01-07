"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { CircleDot, CircleCheck, MessageSquare } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { FeedbackLabelBadge } from "./feedback-label-badge";
import type { RouterOutputs } from "@/trpc/react";

type GithubIssue = RouterOutputs["feedback"]["list"]["issues"][number];

interface FeedbackCardProps {
  issue: GithubIssue;
}

export function FeedbackCard({ issue }: FeedbackCardProps) {
  const params = useParams();
  const lng = params.lng as string;

  const isOpen = issue.state === "open";
  const Icon = isOpen ? CircleDot : CircleCheck;
  const iconColor = isOpen ? "text-green-600" : "text-purple-600";

  const timeAgo = getTimeAgo(issue.created_at);

  return (
    <Link
      href={`/${lng}/feedback/${issue.number}`}
      className="block border-b border-border px-4 py-3 transition-colors hover:bg-muted/50"
    >
      <div className="flex items-start gap-3">
        <Icon className={`mt-1 h-4 w-4 shrink-0 ${iconColor}`} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-foreground hover:text-primary">
              {issue.title}
            </h3>
            {issue.labels
              .filter((label): label is Exclude<typeof label, string> => typeof label !== "string")
              .map((label) => (
                <FeedbackLabelBadge key={label.name} label={label} />
              ))}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>#{issue.number}</span>
            <span>opened {timeAgo}</span>
            <span>by</span>
            {issue.user && (
              <span className="inline-flex items-center gap-1">
                <Avatar className="h-4 w-4">
                  <AvatarImage src={issue.user.avatar_url} alt={issue.user.login} />
                  <AvatarFallback>{issue.user.login[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                {issue.user.login}
              </span>
            )}
            {issue.comments > 0 && (
              <span className="inline-flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                {issue.comments}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
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
