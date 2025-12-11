"use client";

import { ModSortKey, SortOrder } from "@dicecho/types";
import { ArrowUpNarrowWide, ArrowDownNarrowWide } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "@/lib/i18n/react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import qs from "qs";
import { ButtonGroup } from "@/components/ui/button-group";
import { ComponentProps } from "react";

const SortKeys = [
  ModSortKey.RELEASE_DATE,
  ModSortKey.RATE_COUNT,
  ModSortKey.RATE_AVG,
  ModSortKey.LAST_RATE_AT,
  ModSortKey.LAST_EDIT_AT,
  ModSortKey.CREATED_AT,
  ModSortKey.UPDATED_AT,
] as const;

export interface ScenarioSortProps extends ComponentProps<"div"> {}

export function ScenarioSort({ className }: ScenarioSortProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = qs.parse(searchParams.toString());

  const sortKey = query.sort
    ? (Object.keys(query.sort)[0] as ModSortKey)
    : ModSortKey.LAST_RATE_AT;
  const sortOrder = query.sort ? Object.values(query.sort)[0] : SortOrder.DESC;

  const handleSortKeyChange = (newSortKey: ModSortKey) => {
    const currentQuery = qs.parse(searchParams.toString());

    const newQuery = {
      ...currentQuery,
      sort: {
        [newSortKey]: sortOrder,
      },
    };

    // Use current pathname, not hardcoded path
    router.push(`${pathname}?${qs.stringify(newQuery)}`);
  };

  const handleSortOrderToggle = () => {
    const newSortOrder =
      sortOrder === SortOrder.DESC.toString()
        ? SortOrder.ASC.toString()
        : SortOrder.DESC.toString();

    // Parse current query params
    const currentQuery = qs.parse(searchParams.toString());

    // Update only the sort order
    const newQuery = {
      ...currentQuery,
      sort: {
        [sortKey]: newSortOrder,
      },
    };

    router.push(`${pathname}?${qs.stringify(newQuery)}`);
  };

  return (
    <ButtonGroup orientation="horizontal" className={className}>
      <Select value={sortKey} onValueChange={handleSortKeyChange}>
        <SelectTrigger size="sm" className="capitalize">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SortKeys.map((key) => (
            <SelectItem key={key} value={key} className="capitalize">
              {t(`sort_by_${key}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        size="sm"
        variant="outline"
        onClick={handleSortOrderToggle}
      >
        {sortOrder === SortOrder.DESC.toString() ? (
          <ArrowDownNarrowWide size={16} />
        ) : (
          <ArrowUpNarrowWide size={16} />
        )}
      </Button>
    </ButtonGroup>
  );
}
