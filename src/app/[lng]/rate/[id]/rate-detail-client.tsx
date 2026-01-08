"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useDicecho } from "@/hooks/useDicecho";
import { useTranslation } from "@/lib/i18n/react";
import { api } from "@/trpc/react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RateItem } from "@/components/Rate/RateItem";
import { CommentSection } from "@/components/Comment/CommentSection";
import { MobileCommentFooter } from "@/components/Comment/mobile-comment-footer";
import { RateDetailHeader } from "./rate-detail-header";
import { RateDetailSkeleton } from "./rate-detail-skeleton";

const COMMENT_SORT_OPTIONS = [
  { key: "created", labelKey: "comment_sort_oldest", value: { createdAt: 1 } },
  { key: "-created", labelKey: "comment_sort_newest", value: { createdAt: -1 } },
  { key: "like", labelKey: "comment_sort_likes", value: { likeCount: -1 } },
] as const;

interface RateDetailClientProps {
  rateId: string;
}

export function RateDetailClient({ rateId }: RateDetailClientProps) {
  const { api: dicechoApi, session } = useDicecho();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [commentSort, setCommentSort] = useState("created");

  // accessToken is used to get user-specific data (like isLiked) and differentiate queryKey
  const { data: rate } = api.rate.detail.useQuery({
    id: rateId,
    accessToken: session?.user?.accessToken,
  });

  const [commentCount, setCommentCount] = useState(rate?.commentCount ?? 0);

  if (!rate) {
    return <RateDetailSkeleton />;
  }
  const currentSortOption =
    COMMENT_SORT_OPTIONS.find((opt) => opt.key === commentSort) ??
    COMMENT_SORT_OPTIONS[0];

  const handleMobileComment = async (content: string) => {
    await dicechoApi.comment.create("Rate", rate._id, { content });
    await queryClient.invalidateQueries({
      queryKey: ["comments", "Rate", rate._id],
      exact: false,
    });
    setCommentCount((prev) => prev + 1);
  };

  return (
    <>
      <RateDetailHeader rate={rate} />
      <div className="pb-16 pt-16 md:pb-0 md:pt-4">
        <Card className="max-md:rounded-none p-0">
          <CardContent className="p-4 md:p-6">
            <RateItem rate={rate} hideComments showMod foldable={false} />
          </CardContent>
        </Card>

        {/* Comments */}
        <div className="mt-2 md:mt-6 mb-4">
          <Card className="max-md:rounded-none p-0">
            <CardContent className="p-4 md:p-6">
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
              <CommentSection
                targetName="Rate"
                targetId={rate._id}
                hideComposerOnMobile
                sort={currentSortOption.value}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <MobileCommentFooter onSubmit={handleMobileComment} />
    </>
  );
}
