"use client";

import { TopicList } from "@/components/forum/topic-list";
import { useTranslation } from "@/lib/i18n/react";
import type { ITopicDto } from "@/types/topic";
import type { PaginatedResponse } from "@dicecho/types";

interface AccountTopicClientProps {
  lng: string;
  userId: string;
  initialData: PaginatedResponse<ITopicDto> | null;
}

export function AccountTopicClient({
  lng,
  userId,
  initialData,
}: AccountTopicClientProps) {
  const { t } = useTranslation();

  return (
    <TopicList
      lng={lng}
      query={{ filter: { author: userId } }}
      initialData={initialData ?? undefined}
      emptyText={t("topic_empty_user")}
    />
  );
}
