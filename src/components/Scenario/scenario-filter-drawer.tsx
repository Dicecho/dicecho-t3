"use client";

import { PropsWithChildren, useState } from "react";
import type { ModFilterConfig } from "@dicecho/types";
import { queryToFormData, formDataToQuery } from "@/components/Scenario/utils";
import {
  ScenarioFilter,
  type FilterValue,
} from "@/components/Scenario/ScenarioFilter";
import qs from "qs";
import { usePathname, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useDicecho } from "@/hooks/useDicecho";
import { useScenarioFilterParams } from "@/components/Scenario/use-scenario-filter-params";
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
  const pathname = usePathname();
  const router = useRouter();
  const filterQuery = useScenarioFilterParams();
  const { api } = useDicecho();

  const [pendingValue, setPendingValue] = useState<FilterValue>(() =>
    queryToFormData(filterQuery),
  );

  const { data: config } = useQuery({
    queryKey: ["scenario", "config"],
    queryFn: () => api.module.config(),
    initialData: initialConfig,
  });

  const applyFilter = (value: FilterValue) => {
    const newQuery = {
      ...filterQuery,
      ...formDataToQuery(value),
    };

    router.push(`${pathname}?${qs.stringify(newQuery)}`);
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setPendingValue(queryToFormData(filterQuery));
    } else {
      const currentValue = queryToFormData(filterQuery);
      const pendingValueStr = JSON.stringify(pendingValue);
      const currentValueStr = JSON.stringify(currentValue);
      if (pendingValueStr !== currentValueStr) {
        applyFilter(pendingValue);
        return;
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
