"use client";

import { PropsWithChildren, useState } from "react";
import type { ModFilterConfig } from "@dicecho/types";
import { ScenarioFilter } from "@/components/Scenario/ScenarioFilter";
import { useQuery } from "@tanstack/react-query";
import { useDicecho } from "@/hooks/useDicecho";
import {
  useScenarioSearchParams,
  paramsToFilterValue,
  filterValueToParams,
  type FilterValue,
} from "@/components/Scenario/use-scenario-search-params";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useTranslation } from "@/lib/i18n/react";

interface ScenarioFilterDrawerProps {
  initialConfig?: ModFilterConfig;
}

export function ScenarioFilterDrawer({
  initialConfig,
  children,
}: PropsWithChildren<ScenarioFilterDrawerProps>) {
  const { t } = useTranslation();
  const [params, setParams] = useScenarioSearchParams();
  const { api } = useDicecho();

  const [pendingValue, setPendingValue] = useState<FilterValue>(() =>
    paramsToFilterValue(params)
  );

  const { data: config } = useQuery({
    queryKey: ["scenario", "config"],
    queryFn: () => api.module.config(),
    initialData: initialConfig,
  });

  const handleOpenChange = (open: boolean) => {
    if (open) {
      // Sync pending value with current params when opening
      setPendingValue(paramsToFilterValue(params));
    } else {
      // Apply pending value when closing
      const currentValue = paramsToFilterValue(params);
      const pendingValueStr = JSON.stringify(pendingValue);
      const currentValueStr = JSON.stringify(currentValue);
      if (pendingValueStr !== currentValueStr) {
        setParams(filterValueToParams(pendingValue));
      }
    }
  };

  return (
    <Drawer direction="right" onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="top-0 right-0 bottom-auto left-auto mt-0 h-full w-[60vw] overflow-hidden rounded-none border-0">
        <DrawerHeader>
          <DrawerTitle>{t("filter")}</DrawerTitle>
        </DrawerHeader>
        <div className="flex flex-col gap-2 flex-1 overflow-y-auto px-4">
          <ScenarioFilter
            config={config}
            value={pendingValue}
            onChange={setPendingValue}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
