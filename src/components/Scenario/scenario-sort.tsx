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
import { ButtonGroup } from "@/components/ui/button-group";
import { ComponentProps } from "react";
import { useScenarioSearchParams } from "./use-scenario-search-params";

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
  const [params, setParams] = useScenarioSearchParams();

  const sortKey = params.sortKey;
  const sortOrder = params.sortOrder;

  const handleSortKeyChange = (newSortKey: string) => {
    setParams({ sortKey: newSortKey as ModSortKey });
  };

  const handleSortOrderToggle = () => {
    const newSortOrder =
      sortOrder === SortOrder.DESC ? SortOrder.ASC : SortOrder.DESC;
    setParams({ sortOrder: newSortOrder });
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

      <Button size="sm" variant="outline" onClick={handleSortOrderToggle}>
        {sortOrder === SortOrder.DESC ? (
          <ArrowDownNarrowWide size={16} />
        ) : (
          <ArrowUpNarrowWide size={16} />
        )}
      </Button>
    </ButtonGroup>
  );
}
