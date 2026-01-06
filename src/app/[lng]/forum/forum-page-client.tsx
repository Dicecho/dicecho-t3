"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { TopicList } from "@/components/forum/topic-list";
import { TopicSortSelect } from "@/components/forum/topic-sort-select";
import { ForumSidebar } from "@/components/forum/forum-sidebar";
import { TopicFormDialog } from "@/components/forum/topic-form-dialog";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/react";
import { PenSquare } from "lucide-react";
import { TopicSortKey, TOPIC_SORT_OPTIONS, type ITopicDto } from "@/types/topic";
import type { PaginatedResponse } from "@dicecho/types";

interface ForumPageClientProps {
  lng: string;
  initialData: PaginatedResponse<ITopicDto> | null;
  initialSort: TopicSortKey;
}

export function ForumPageClient({
  lng,
  initialData,
  initialSort,
}: ForumPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();

  const currentSort = (searchParams.get("sort") as TopicSortKey) || initialSort;

  const handleSortChange = (value: TopicSortKey) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    const queryString = params.toString();
    router.push(`/${lng}/forum${queryString ? `?${queryString}` : ""}`);
  };

  return (
    <>
      <div className="grid grid-cols-6 gap-8">
        <div className="col-span-6 md:col-span-4">
          {/* Sticky header */}
          <div className="bg-background/95 supports-backdrop-filter:bg-background/85 sticky top-14 md:top-16 z-5 mb-4 flex items-center justify-between border-b py-3 backdrop-blur">
            <div className="text-muted-foreground text-sm">
              {initialData && t("search_result", { count: initialData.totalCount })}
            </div>
            <TopicSortSelect value={currentSort} onValueChange={handleSortChange} />
          </div>

          <TopicList
            lng={lng}
            query={{ sort: TOPIC_SORT_OPTIONS[currentSort].value }}
            initialData={initialData ?? undefined}
          />
        </div>

        <div className="hidden md:col-span-2 md:block">
          <div className="sticky top-20">
            <ForumSidebar />
          </div>
        </div>
      </div>

      {/* Mobile create button */}
      <TopicFormDialog>
        <Button
          className="fixed right-4 bottom-20 z-50 h-14 w-14 rounded-full shadow-lg md:hidden"
          size="icon"
        >
          <PenSquare className="h-6 w-6" />
        </Button>
      </TopicFormDialog>
    </>
  );
}
