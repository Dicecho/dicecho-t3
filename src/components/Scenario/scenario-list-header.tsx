"use client";
import { Trans } from "react-i18next";
import { useTranslation } from "@/lib/i18n/react";

import type { IModListQuery } from "@dicecho/types";
import type { ComponentProps, FC } from "react";
import { FilterIcon, Loader2 } from "lucide-react";
import { ScenarioSort } from "./scenario-sort";
import { ScenarioFilterDrawer } from "./scenario-filter-drawer";
import { Button } from "@/components/ui/button";
import { useScenarioFilterParams } from "./use-scenario-filter-params";
import { cn } from "@/lib/utils";

interface ScenarioListProps extends ComponentProps<"div"> {
  totalCount?: number;
  query?: Partial<IModListQuery>;
}

export const ScenarioListHeader: FC<ScenarioListProps> = ({
  totalCount,
  query = {},
  className,
  ...props
}) => {
  const { t } = useTranslation();

  const filterQuery = useScenarioFilterParams();
  const isFilterApplied = Object.keys(filterQuery).length > 2;

  return (
    <div
      className={cn(
        "bg-background/95 supports-backdrop-filter:bg-background/70 sticky top-16 z-5 mb-4 flex items-center gap-2 border-b py-4 text-sm backdrop-blur",
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        <Trans
          className="text-muted-foreground"
          i18nKey="search_result"
          t={t}
          values={{
            count: totalCount ?? "",
          }}
          components={{
            loading: totalCount !== undefined ? <></> : <Loader2 className="h-4 w-4 animate-spin" />,
          }}
        />
      </div>
      <ScenarioSort className="ml-auto" />

      <ScenarioFilterDrawer>
        <Button
          className="md:hidden"
          variant={isFilterApplied ? "default" : "outline"}
          size="sm"
        >
          <FilterIcon size={16} />
        </Button>
      </ScenarioFilterDrawer>
    </div>
  );
};
