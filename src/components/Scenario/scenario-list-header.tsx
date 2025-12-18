"use client";
import { Trans } from "react-i18next";
import { useTranslation } from "@/lib/i18n/react";

import { useMemo, type ComponentProps, type FC } from "react";
import { FilterIcon, Loader2 } from "lucide-react";
import { ScenarioSort } from "./scenario-sort";
import { ScenarioFilterDrawer } from "./scenario-filter-drawer";
import { Button } from "@/components/ui/button";
import { useScenarioSearchParams } from "@/components/Scenario/use-scenario-search-params";
import { cn } from "@/lib/utils";
import { ScenarioSearchInput } from "./search-input";
import { Badge } from "@/components/ui/badge";

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

  const filterCount = useMemo(() => {
    let count = 0;
    if (params.rule !== null) count++;
    if (params.language !== null) count++;
    if (params.tags !== null) count++;
    if (params.minPlayer !== null || params.maxPlayer !== null) count++;
    if (params.isForeign !== null) count++;
    return count;
  }, [params]);

  return (
    <div
      className={cn(
        "bg-background/95 supports-backdrop-filter:bg-background/85 sticky top-16 z-5 mb-4 flex flex-col border-b py-4 backdrop-blur",
        className,
      )}
      {...props}
    >
      <ScenarioSearchInput className="mb-4 max-md:hidden" />
      <div className={cn("flex items-center gap-2 text-sm")}>
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
            className="relative md:hidden"
            variant={"outline"}
            size="sm"
          >
            <FilterIcon size={16} />
            {filterCount > 0 && (
              <Badge
                className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full px-1 font-mono text-xs tabular-nums"
              >
                {filterCount}
              </Badge>
            )}
          </Button>
        </ScenarioFilterDrawer>
      </div>
    </div>
  );
};
