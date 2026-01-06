"use client";

import { useState } from "react";
import { ITopicDto } from "@/types/topic";
import { Card } from "@/components/ui/card";
import { Eye, MessageSquare, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { getDateFnsLocale } from "@/lib/i18n/date-fns-locale";
import { UserAvatar } from "@/components/User/Avatar";
import { ScenarioWidget } from "@/components/Scenario/widget";
import { RichTextPreview } from "@/components/Editor/RichTextPreview";
import { useTranslation } from "@/lib/i18n/react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { UserInfoCard } from "../User";

interface TopicCardProps {
  topic: ITopicDto;
  lng: string;
  showDomain?: boolean;
  className?: string;
}

export function TopicCard({
  topic,
  lng,
  showDomain = false,
  className,
}: TopicCardProps) {
  const { t } = useTranslation();
  const [showSpoiler, setShowSpoiler] = useState(false);

  const formatDate = (date: Date) => {
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
      locale: getDateFnsLocale(lng),
    });
  };

  const isSpoilerHidden = topic.isSpoiler && !showSpoiler;

  return (
    <Link href={`/${lng}/forum/topic/${topic._id}`}>
      <Card
        className={cn(
          "max-md:rounded-none p-0",
          "cursor-pointer transition-shadow hover:shadow-xl ",
          className,
        )}
      >
        <div className="p-4">
          {showDomain && topic.domain ? (
            <div className="mb-3 flex items-center gap-2">
              <UserAvatar
                user={{
                  avatarUrl: topic.domain.coverUrl,
                  nickName: topic.domain.title,
                }}
                className="h-8 w-8"
              />
              <div className="flex-1">
                <div className="text-sm font-medium">{topic.domain.title}</div>
                <div className="text-muted-foreground flex items-center gap-2 text-xs">
                  <span>{topic.author.nickName}</span>
                  <span>·</span>
                  <span>{formatDate(topic.createdAt)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-muted-foreground mb-3 flex items-center gap-2 text-sm">
              <UserAvatar user={topic.author} className="h-6 w-6" />
              <span>{topic.author.nickName}</span>
              <span>·</span>
              <span>{formatDate(topic.createdAt)}</span>
              <span>·</span>
              <span>{topic.domain?.title}</span>
            </div>
          )}

          <h3 className="mb-2 text-lg font-semibold">{topic.title}</h3>

          {topic.relatedMods && topic.relatedMods.length > 0 && (
            <div
              className="mb-3 flex flex-col gap-2"
              onClick={(e) => e.preventDefault()}
            >
              {topic.relatedMods.slice(0, 2).map((mod) => (
                <ScenarioWidget key={mod._id} scenario={mod} variant="compact" />
              ))}
            </div>
          )}

          {topic.content && (
            <div className="relative mb-4">
              <div
                className={cn(
                  "max-h-40 overflow-hidden",
                  isSpoilerHidden && "blur-sm select-none",
                )}
              >
                <RichTextPreview markdown={topic.content.slice(0, 300)} />
              </div>
              <div className="from-card pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t to-transparent" />
              {isSpoilerHidden && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowSpoiler(true);
                    }}
                  >
                    {t("topic_spoiler_warning")} [{t("show")}]
                  </Button>
                </div>
              )}
            </div>
          )}

          <div className="text-muted-foreground flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <ThumbsUp className="h-4 w-4" />
              <span>{topic.likeCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              <span>{topic.commentCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{topic.readCount}</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
