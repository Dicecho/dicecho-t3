"use client";
import { Trans } from "react-i18next";
import { useTranslation } from "@/lib/i18n/react";

import type { ComponentProps, FC } from "react";
import { FilterIcon, Loader2 } from "lucide-react";
import { ScenarioSort } from "./scenario-sort";
import { ScenarioFilterDrawer } from "./scenario-filter-drawer";
import { Button } from "@/components/ui/button";
import { useScenarioSearchParams } from "@/components/Scenario/use-scenario-search-params";
import { cn } from "@/lib/utils";
import { ScenarioSearchInput } from "./search-input";

interface ScenarioListProps extends ComponentProps<"div"> {
  totalCount?: number;
}

export const ScenarioListHeader: FC<ScenarioListProps> = ({
  totalCount,
  className,
  ...props
}) => {
  const { t } = useTranslation();
  const [params] = useScenarioSearchParams();

  // Check if any filter (excluding sort) is applied
  const isFilterApplied =
    params.rule !== null ||
    params.language !== null ||
    params.tags !== null ||
    params.minPlayer !== null ||
    params.maxPlayer !== null ||
    params.isForeign !== null;

  return (
    <div
      className={cn(
        "bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/85 sticky top-16 z-5 mb-4 flex flex-col border-b py-4 ",
        className,
      )}
      {...props}
    >
      <ScenarioSearchInput className="max-md:hidden mb-4" />
      <div
        className={cn(
          "flex items-center gap-2 text-sm",
        )}
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
              loading:
                totalCount !== undefined ? (
                  <></>
                ) : (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ),
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
    </div>
  );
};
