"use client";

import { useState, type FC } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReplayList } from "./replay-list";
import { ReplayItemSkeleton } from "./replay-item-skeleton";
import { useTranslation } from "@/lib/i18n/react";
import type { ReplayListResponse, ReplayListQuery } from "@/types/replay";

type SortOption = "newest" | "oldest" | "popular";

const SORT_CONFIGS: Record<SortOption, Partial<ReplayListQuery>> = {
  newest: { sort: { createdAt: -1 } },
  oldest: { sort: { createdAt: 1 } },
  popular: { sort: { view: -1 } },
};

interface ReplayListSectionProps {
  initialData?: ReplayListResponse;
  className?: string;
}

export const ReplayListSection: FC<ReplayListSectionProps> = ({
  initialData,
  className,
}) => {
  const { t } = useTranslation();
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">{t("replay_all")}</h2>
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">{t("sort_newest")}</SelectItem>
            <SelectItem value="oldest">{t("sort_oldest")}</SelectItem>
            <SelectItem value="popular">{t("sort_popular")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ReplayList
        key={sortBy}
        initialData={sortBy === "newest" ? initialData : undefined}
        query={SORT_CONFIGS[sortBy]}
        className={className}
      />
    </section>
  );
};
