"use client";

import { TagCard } from "@/components/Search/TagCard";
import { TagCardSkeleton } from "@/components/Search/TagCardSkeleton";
import { Empty } from "@/components/Empty";
import { useTranslation } from "@/lib/i18n/react";
import { useDicecho } from "@/hooks/useDicecho";
import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function TagSearchPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const lng = params.lng as string;
  const keyword = searchParams.get("keyword") || "";
  const { t } = useTranslation();
  const { api } = useDicecho();

  // Fetch tags
  const { data: tagsData, isLoading } = useQuery({
    queryKey: ["search", "tags", keyword],
    queryFn: () => api.search.tag({ keyword, pageSize: 100 }),
    enabled: !!keyword,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <TagCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!tagsData || tagsData.totalCount === 0) {
    return <Empty emptyText={t("search_no_tag")} />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {tagsData.data.map((tag) => (
        <Link key={tag._id} href={`/${lng}/tag/${tag._id}`}>
          <TagCard tag={tag} />
        </Link>
      ))}
    </div>
  );
}
