"use client";

import { useMemo, useState } from "react";
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Empty } from "@/components/Empty";
import { UserAvatar } from "@/components/User/Avatar";
import { useDicecho } from "@/hooks/useDicecho";
import { useAccount } from "@/hooks/useAccount";
import { useTranslation } from "@/lib/i18n/react";
import type { IUserDto } from "@dicecho/types";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { LinkWithLng } from "@/components/Link";

type FollowListProps = {
  userId: string;
  type: "followers" | "followings";
};

export const AccountFollowList = ({ userId, type }: FollowListProps) => {
  const { api, initialized } = useDicecho();
  const { account, isAuthenticated } = useAccount();
  const { t } = useTranslation();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["account", type, userId, account?._id] as const,
      queryFn: async ({ queryKey, pageParam = 1 }) => {
        const [_, type, userId, accountId] = queryKey;
        return type === "followers"
          ? api.user.followers(userId, { page: pageParam, pageSize: 20 })
          : api.user.followings(userId, { page: pageParam, pageSize: 20 });
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage) =>
        lastPage.hasNext ? lastPage.page + 1 : undefined,
      enabled: initialized,
    });

  const entries = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data],
  );

  const canInteract = (user: IUserDto) =>
    isAuthenticated && account._id !== user._id;

  const handleAction = async (
    targetId: string,
    action: "follow" | "unfollow",
  ) => {
    setPendingId(targetId);
    try {
      if (action === "follow") {
        await api.user.follow(targetId);
        toast.success(t("follow_success"));
      } else {
        await api.user.unfollow(targetId);
        toast.success(t("unfollow_success"));
      }
      await queryClient.invalidateQueries({
        queryKey: ["account", type, userId, account?._id],
      });
      await queryClient.invalidateQueries({
        queryKey: ["user", "profile", targetId],
      });
    } finally {
      setPendingId(null);
    }
  };

  return (
    <Card className="p-0">
      <CardContent className="flex flex-col gap-4 p-0">
        {isLoading ? (
          <div className="flex flex-col gap-3 divide-y">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3 px-4 py-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-8 w-20" />
              </div>
            ))}
          </div>
        ) : entries.length === 0 ? (
          <Empty>
            <div className="text-muted-foreground">
              {type === "followers"
                ? t("followers_empty")
                : t("followings_empty")}
            </div>
          </Empty>
        ) : (
          <>
            <div className="divide-y rounded-lg">
              {entries.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-row gap-3 px-4 py-4 text-sm sm:flex-row sm:items-center"
                >
                  <LinkWithLng href={`/account/${item._id}`}>
                    <div className="flex items-center gap-3">
                      <UserAvatar
                        user={item}
                        className="h-12 w-12 rounded-full"
                      />
                      <div>
                        <div className="leading-tight font-medium">
                          {item.nickName}
                        </div>
                        {item.note && (
                          <p className="text-muted-foreground line-clamp-1">
                            {item.note}
                          </p>
                        )}
                      </div>
                    </div>
                  </LinkWithLng>
                  {canInteract(item) && (
                    <div className="ml-auto flex items-center gap-2">
                      <Button
                        variant={item.isFollowed ? "outline" : "default"}
                        size="sm"
                        disabled={pendingId === item._id}
                        onClick={() =>
                          handleAction(
                            item._id,
                            item.isFollowed ? "unfollow" : "follow",
                          )
                        }
                      >
                        {item.isFollowed ? t("unfollow") : t("follow")}
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {hasNextPage && (
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? t("loading") : t("load_more")}
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
