"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useDicecho } from "@/hooks/useDicecho";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { useTranslation } from "@/lib/i18n/react";
import { UserAvatar } from "@/components/User/Avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  InlineComboboxContent,
  InlineComboboxEmpty,
  InlineComboboxGroup,
  InlineComboboxItem,
} from "@/components/ui/inline-combobox";
import { MobileMentionPanel } from "./MobileMentionPanel";

export interface MentionUserItem {
  key: string;
  text: string;
  avatarUrl?: string;
  pendantUrl?: string;
  followerCount?: number;
}

interface UserMentionComboboxProps {
  search: string;
  onSelectItem: (item: MentionUserItem) => void;
}

export function UserMentionCombobox({
  search,
  onSelectItem,
}: UserMentionComboboxProps) {
  const { t } = useTranslation();
  const { api } = useDicecho();
  const { data: session } = useSession();
  const isMobile = useIsMobile();
  const userId = session?.user?._id;
  const hasSearch = !!search.trim();

  // 关注列表（默认展示）
  const { data: followings = [], isFetching: isFetchingFollowings } = useQuery({
    queryKey: ["mention-followings", userId],
    queryFn: async () => {
      const result = await api.user.followings(userId!, { pageSize: 10 });
      return result.data.map(
        (user): MentionUserItem => ({
          key: user._id,
          text: user.nickName,
          avatarUrl: user.avatarUrl,
          pendantUrl: user.pendantUrl,
          followerCount: user.followerCount,
        })
      );
    },
    enabled: !!userId && !hasSearch,
    staleTime: 60000,
  });

  // 搜索结果
  const { data: searchResults = [], isFetching: isFetchingSearch } = useQuery({
    queryKey: ["mention-search", search],
    queryFn: async () => {
      const result = await api.search.user({
        keyword: search,
        pageSize: 10,
      });
      return result.data.map(
        (user): MentionUserItem => ({
          key: user._id,
          text: user.nickName,
          avatarUrl: user.avatarUrl,
          pendantUrl: user.pendantUrl,
          followerCount: user.followerCount,
        })
      );
    },
    enabled: !!search.trim(),
    staleTime: 30000,
  });

  // 最终展示：有搜索内容用搜索结果，否则用关注列表
  const items = hasSearch ? searchResults : followings;
  const isLoading = hasSearch ? isFetchingSearch : isFetchingFollowings;

  const content = (
    <>
      <InlineComboboxEmpty className="px-4 py-3 font-medium">
        {hasSearch ? t("search_no_user") : t("followings_empty")}
      </InlineComboboxEmpty>

      <InlineComboboxGroup>
        {isLoading
          ? [1, 2, 3].map((i) => (
              <InlineComboboxItem
                key={`skeleton-${i}`}
                value={`loading-${i}`}
                disabled
                hideOnClick={false}
                className="flex items-center gap-3 px-4 py-2.5 h-auto"
              >
                <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </InlineComboboxItem>
            ))
          : items.map((item) => (
              <InlineComboboxItem
                key={item.key}
                value={item.text}
                onClick={() => onSelectItem(item)}
                className="flex items-center gap-3 px-4 py-2.5 h-auto"
              >
                <UserAvatar
                  user={{
                    avatarUrl: item.avatarUrl,
                    pendantUrl: item.pendantUrl,
                    nickName: item.text,
                  }}
                  className="h-10 w-10 shrink-0"
                />
                <div className="flex flex-col min-w-0">
                  <span className="font-medium truncate">{item.text}</span>
                  <span className="text-sm text-muted-foreground">
                    {item.followerCount ?? 0} {t("followers")}
                  </span>
                </div>
              </InlineComboboxItem>
            ))}
      </InlineComboboxGroup>
    </>
  );

  // 移动端：底部固定面板
  if (isMobile) {
    return <MobileMentionPanel>{content}</MobileMentionPanel>;
  }

  // PC 端：光标附近浮动 popover
  return (
    <InlineComboboxContent className="my-1.5 w-[360px]">
      {content}
    </InlineComboboxContent>
  );
}
