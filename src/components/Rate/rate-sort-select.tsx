"use client";
import { SortOrder } from "@dicecho/types";
import { ArrowDownWideNarrowIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import * as SelectPrimitive from "@radix-ui/react-select";
import { RateSortKey } from "@dicecho/types";
import { useTranslation } from "@/lib/i18n/react";
import type { IRateListQuery } from "@dicecho/types";
import type { FC } from "react";

export enum RateSortOption {
  Recommend = "recommend_rate",
  Happiest = "happiest_rate",
  Longest = "longest_rate",
  Latest = "latest_rate",
  Oldest = "oldest_rate",
}

const RateSortOptionMap: Record<RateSortOption, IRateListQuery["sort"]> = {
  [RateSortOption.Recommend]: { [RateSortKey.WILSON_SCORE]: -1 },
  [RateSortOption.Happiest]: { [RateSortKey.HAPPY_COUNT]: -1 },
  [RateSortOption.Longest]: { [RateSortKey.REMARK_LENGTH]: -1 },
  [RateSortOption.Latest]: { [RateSortKey.RATE_AT]: -1 },
  [RateSortOption.Oldest]: { [RateSortKey.RATE_AT]: 1 },
};

interface RateSortSelectProps {
  value?: IRateListQuery["sort"];
  onChange: (value: IRateListQuery["sort"]) => void;
  className?: string;
}

export const RateSortSelect: FC<RateSortSelectProps> = ({
  value,
  onChange,
  className,
}) => {
  const { t } = useTranslation();

  const currentSort = (() => {
    if (value?.wilsonScore === SortOrder.DESC) return RateSortOption.Recommend;
    if (value?.["declareCounts.happy"] === SortOrder.DESC) return RateSortOption.Happiest;
    if (value?.remarkLength === SortOrder.DESC) return RateSortOption.Longest;
    if (value?.rateAt === SortOrder.DESC) return RateSortOption.Latest;
    if (value?.rateAt === SortOrder.ASC) return RateSortOption.Oldest;
    return undefined;
  })();

  const handleChange = (v: string) => {
    if (Object.values(RateSortOption).includes(v as RateSortOption)) {
      onChange(RateSortOptionMap[v as RateSortOption]);
    }
  };

  return (
    <Select value={currentSort ?? ""} onValueChange={handleChange}>
      <SelectPrimitive.Trigger asChild>
        <Button variant="outline" className={className}>
          <ArrowDownWideNarrowIcon width={16} />
          <SelectValue />
        </Button>
      </SelectPrimitive.Trigger>
      <SelectContent>
        {Object.values(RateSortOption).map((sort) => (
          <SelectItem key={sort} value={sort}>
            {t(`Rate.${sort}`)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
