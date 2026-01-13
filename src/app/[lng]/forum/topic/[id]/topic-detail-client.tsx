"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { getDateFnsLocale } from "@/lib/i18n/date-fns-locale";
import { useTranslation } from "@/lib/i18n/react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/User/Avatar";
import { LinkWithLng } from "@/components/Link";
import { TopicFormDialog } from "@/components/forum/topic-form-dialog";
import { TopicDeleteDialog } from "@/components/forum/topic-delete-dialog";
import { TopicActions } from "@/components/forum/topic-actions";
import { TopicRelatedMods } from "@/components/forum/topic-related-mods";
import { CommentPanel } from "@/components/Comment";
import { RichTextPreview } from "@/components/Editor/RichTextPreview";
import { Pencil, Trash2 } from "lucide-react";
import type { ITopicDto } from "@/types/topic";

interface TopicDetailClientProps {
  topic: ITopicDto;
  lng: string;
}

export function TopicDetailClient({
  topic: initialTopic,
  lng,
}: TopicDetailClientProps) {
  const [topic, setTopic] = useState(initialTopic);
  const { t } = useTranslation();
  const { data: session } = useSession();
  const router = useRouter();

  const formatDate = (date: Date) => {
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
      locale: getDateFnsLocale(lng),
    });
  };

  const canEdit = topic.canEdit || session?.user?._id === topic.author._id;

  return (
    <>
      <div className="grid grid-cols-6 gap-8 pb-16 md:pb-0">
        <div className="col-span-6 md:col-span-4">
          <Card className="max-md:rounded-none p-0">
            <CardContent className="p-4 md:p-6">
              {/* Title */}
              <h1 className="mb-4 text-xl md:text-2xl font-bold">{topic.title}</h1>

              {/* Author */}
              <div className="mb-2 flex items-center gap-2">
                <LinkWithLng href={`/account/${topic.author._id}`}>
                  <UserAvatar user={topic.author} className="h-6 w-6" />
                </LinkWithLng>
                <LinkWithLng href={`/account/${topic.author._id}`}>
                  <span className="text-sm text-foreground/80 hover:underline">
                    {topic.author.nickName}
                  </span>
                </LinkWithLng>
                {canEdit && (
                  <div className="ml-auto flex gap-1">
                    <TopicFormDialog
                      topic={topic}
                      onSuccess={(updatedTopic) => {
                        setTopic(updatedTopic);
                        toast.success(t("topic_updated"));
                      }}
                    >
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    </TopicFormDialog>
                    <TopicDeleteDialog
                      topicId={topic._id}
                      onSuccess={() => {
                        toast.success(t("topic_deleted"));
                        router.push(`/${lng}/forum`);
                      }}
                    >
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </TopicDeleteDialog>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="text-muted-foreground mb-4 flex items-center gap-4 text-sm">
                <span>{topic.readCount} {t("topic_stat_reads")}</span>
                <span>{topic.likeCount} {t("topic_stat_likes")}</span>
                <span>{topic.commentCount} {t("topic_stat_comments")}</span>
              </div>

              {/* Related Mods - show before content like old project */}
              {topic.relatedMods && topic.relatedMods.length > 0 && (
                <TopicRelatedMods mods={topic.relatedMods} />
              )}

              {/* Spoiler warning */}
              {topic.isSpoiler && (
                <div className="bg-destructive/10 text-destructive mb-4 rounded-lg p-3 text-sm">
                  {t("topic_spoiler_warning")}
                </div>
              )}

              {/* Content - rendered as markdown */}
              <div className="mb-6">
                <RichTextPreview markdown={topic.content} />
              </div>

              {/* Footer info */}
              <div className="text-muted-foreground mb-4 text-sm">
                {t("topic_posted_at")} {formatDate(topic.createdAt)}
              </div>

              {/* Actions */}
              <TopicActions topic={topic} onUpdate={setTopic} />
            </CardContent>
          </Card>

          {/* Comments */}
          <div className="mt-2 md:mt-6 mb-4">
            <Card className="max-md:rounded-none p-0">
              <CardContent className="p-4 md:p-6">
                <CommentPanel
                  targetName="Topic"
                  targetId={topic._id}
                  initialCount={topic.commentCount}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar - hidden on mobile */}
        <div className="hidden md:col-span-2 md:block">
          <div className="sticky top-20">
            <Card>
              <CardContent className="p-4">
                <LinkWithLng href={`/account/${topic.author._id}`}>
                  <div className="flex items-center gap-3">
                    <UserAvatar user={topic.author} className="h-12 w-12" />
                    <div>
                      <div className="font-medium hover:underline">
                        {topic.author.nickName}
                      </div>
                      <div className="text-muted-foreground text-sm">
                        {t("topic_author")}
                      </div>
                    </div>
                  </div>
                </LinkWithLng>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
