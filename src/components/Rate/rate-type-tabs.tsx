"use client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/lib/i18n/react";
import type { FC } from "react";

export enum RateType {
  Rate = 0,
  Mark = 1,
}

interface RateTypeTabsProps {
  value: RateType;
  onChange: (value: RateType) => void;
  rateCount?: number;
  markCount?: number;
  className?: string;
}

export const RateTypeTabs: FC<RateTypeTabsProps> = ({
  value,
  onChange,
  rateCount = 0,
  markCount = 0,
  className,
}) => {
  const { t } = useTranslation();

  return (
    <Tabs
      value={value.toString()}
      onValueChange={(v) => onChange(parseInt(v) as RateType)}
      className={className}
    >
      <TabsList className="w-full">
        <TabsTrigger value="0" className="capitalize flex-1">
          {t("Rate.type_rate")}
          {rateCount > 0 && (
            <Badge className="ml-1" variant="accent">
              {rateCount}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="1" className="capitalize flex-1">
          {t("Rate.type_mark")}
          {markCount > 0 && (
            <Badge className="ml-1" variant="accent">
              {markCount}
            </Badge>
          )}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
