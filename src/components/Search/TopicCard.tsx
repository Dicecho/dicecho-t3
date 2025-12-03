"use client";

import { ITopicDto } from "@/types/topic";
import { Card } from "@/components/ui/card";
import { Eye, MessageSquare } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";
import { UserAvatar } from "@/components/User/Avatar";

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
  const formatDate = (date: Date) => {
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
      locale: zhCN,
    });
  };

  return (
    <Link href={`/${lng}/forum/topic/${topic._id}`}>
      <Card className={`cursor-pointer transition-shadow hover:shadow-md ${className || ""}`}>
        <div className="p-4">
          {showDomain && topic.domain ? (
            <div className="mb-3 flex items-center gap-2">
              <UserAvatar user={topic.domain} className="h-8 w-8" />
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
            <div className="text-muted-foreground mb-3 flex items-center gap-2 text-xs">
              <UserAvatar user={topic.author} className="h-6 w-6" />
              <span>{topic.author.nickName}</span>
              <span>·</span>
              <span>{formatDate(topic.createdAt)}</span>
            </div>
          )}

          <h3 className="mb-2 text-lg font-semibold">{topic.title}</h3>

          {topic.content && (
            <p className="text-muted-foreground mb-4 line-clamp-3 text-sm">
              {topic.content.slice(0, 200)}
            </p>
          )}

          <div className="text-muted-foreground flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{topic.readCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              <span>{topic.commentCount}</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

