"use client";

import { useDicecho } from "@/hooks/useDicecho";
import { api } from "@/trpc/react";
import { Card, CardContent } from "@/components/ui/card";
import { RateItem } from "@/components/Rate/RateItem";
import { CommentPanel } from "@/components/Comment";
import { RateDetailHeader } from "./rate-detail-header";
import { RateDetailSkeleton } from "./rate-detail-skeleton";

interface RateDetailClientProps {
  rateId: string;
}

export function RateDetailClient({ rateId }: RateDetailClientProps) {
  const { session } = useDicecho();
  const utils = api.useUtils();
  const userId = session?.user?._id;

  // Use userId as cache key - each user gets their own cached data
  const { data: rate } = api.rate.detail.useQuery(
    {
      id: rateId,
      userId,
    },
    {
      placeholderData: () => utils.rate.detail.getData({ id: rateId }),
    },
  );

  if (!rate) {
    return <RateDetailSkeleton />;
  }

  return (
    <>
      <RateDetailHeader rate={rate} />
      <div className="pb-16 pt-16 md:pb-0 md:pt-4">
        <Card className="max-md:rounded-none p-0">
          <CardContent className="p-4 md:p-6">
            <RateItem rate={rate} hideComments showMod foldable={false} />
          </CardContent>
        </Card>

        <div className="mb-4 mt-2 md:mt-6">
          <Card className="max-md:rounded-none p-0">
            <CardContent className="p-4 md:p-6">
              <CommentPanel
                targetName="Rate"
                targetId={rate._id}
                initialCount={rate.commentCount}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
