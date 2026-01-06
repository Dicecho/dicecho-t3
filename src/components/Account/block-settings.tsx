"use client";

import { useState } from "react";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDicecho } from "@/hooks/useDicecho";
import { useTranslation } from "@/lib/i18n/react";
import { BlockTargetName, type IBlockDto } from "@/types/block";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";

type BlockItemProps = {
  block: IBlockDto;
  onUnblock: () => void;
  isPending: boolean;
};

function BlockItem({ block, onUnblock, isPending }: BlockItemProps) {
  const { t } = useTranslation();

  if (block.targetName === BlockTargetName.User) {
    return (
      <div className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
        <Link
          href={`/account/${block.target._id}`}
          className="flex items-center gap-3"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={block.target.avatarUrl} />
            <AvatarFallback>
              {block.target.nickName?.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">{block.target.nickName}</span>
        </Link>
        <Button
          variant="destructive"
          size="sm"
          onClick={onUnblock}
          disabled={isPending}
        >
          {t("unblock")}
        </Button>
      </div>
    );
  }

  if (block.targetName === BlockTargetName.Mod) {
    return (
      <div className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
        <Link
          href={`/scenario/${block.target._id}`}
          className="flex items-center gap-3"
        >
          {block.target.coverUrl && (
            <div className="relative h-10 w-10 rounded overflow-hidden">
              <Image
                src={block.target.coverUrl}
                alt={block.target.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          <span className="font-medium">{block.target.title}</span>
        </Link>
        <Button
          variant="destructive"
          size="sm"
          onClick={onUnblock}
          disabled={isPending}
        >
          {t("unblock")}
        </Button>
      </div>
    );
  }

  return null;
}

export function BlockSettings() {
  const { api } = useDicecho();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [targetName, setTargetName] = useState<BlockTargetName>(
    BlockTargetName.User
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["blocks", "self", targetName],
    queryFn: ({ pageParam = 1 }) =>
      api.block.self({
        page: pageParam,
        pageSize: 20,
        filter: { targetName },
      }),
    getNextPageParam: (lastPage) => {
      if ((lastPage.page * lastPage.pageSize) < lastPage.totalCount) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });

  const unblockMutation = useMutation({
    mutationFn: ({ targetName, targetId }: { targetName: string; targetId: string }) =>
      api.block.cancel(targetName, targetId),
    onSuccess: () => {
      toast.success(t("unblock_success"));
      queryClient.invalidateQueries({ queryKey: ["blocks", "self", targetName] });
    },
  });

  const blocks = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>{t("settings_block_title")}</CardTitle>
        <Select
          value={targetName}
          onValueChange={(value) => setTargetName(value as BlockTargetName)}
        >
          <SelectTrigger className="min-w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={BlockTargetName.User}>
              {t("block_users")}
            </SelectItem>
            <SelectItem value={BlockTargetName.Mod}>
              {t("block_mods")}
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 py-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-4 w-32" />
                <div className="flex-1" />
                <Skeleton className="h-8 w-20" />
              </div>
            ))}
          </div>
        ) : blocks.length > 0 ? (
          <div>
            {blocks.map((block) => (
              <BlockItem
                key={block._id}
                block={block}
                onUnblock={() =>
                  unblockMutation.mutate({
                    targetName: block.targetName,
                    targetId: block.target._id,
                  })
                }
                isPending={unblockMutation.isPending}
              />
            ))}
            {hasNextPage && (
              <Button
                variant="ghost"
                className="w-full mt-4"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? t("loading") : t("load_more")}
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            {t("no_blocked_items")}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
