"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "@/lib/i18n/react";
import { TopicSortKey, TOPIC_SORT_OPTIONS } from "@/types/topic";

interface TopicSortSelectProps {
  value: TopicSortKey;
  onValueChange: (value: TopicSortKey) => void;
}

export function TopicSortSelect({ value, onValueChange }: TopicSortSelectProps) {
  const { t } = useTranslation();

  return (
    <Select value={value} onValueChange={(v) => onValueChange(v as TopicSortKey)}>
      <SelectTrigger className="w-[140px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {(Object.keys(TOPIC_SORT_OPTIONS) as TopicSortKey[]).map((key) => (
          <SelectItem key={key} value={key}>
            {t(TOPIC_SORT_OPTIONS[key].labelKey)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
