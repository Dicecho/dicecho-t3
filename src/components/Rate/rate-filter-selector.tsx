"use client";
import * as React from "react";
import { RateView as RateViewFilter } from "@dicecho/types";
import { useTranslation } from "@/lib/i18n/react";
import type { IRateListQuery } from "@dicecho/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export enum RateView {
  PL = "view_pl",
  KP = "view_kp",
  OB = "view_ob",
}

export const RateViewMap: Record<RateView, RateViewFilter> = {
  [RateView.PL]: RateViewFilter.PL,
  [RateView.KP]: RateViewFilter.KP,
  [RateView.OB]: RateViewFilter.OB,
};

const RateViewReverseMap = Object.fromEntries(
  Object.entries(RateViewMap).map(([k, v]) => [v, k])
) as Record<RateViewFilter, RateView>;

export enum RemarkLengthRange {
  All = "remark_length_all",
  Short = "remark_length_short",
  Long = "remark_length_long",
}

const RemarkLengthRangeMap: Record<
  RemarkLengthRange,
  IRateListQuery["filter"]["remarkLength"]
> = {
  [RemarkLengthRange.All]: { $gt: 1 },
  [RemarkLengthRange.Short]: { $gt: 1, $lte: 140 },
  [RemarkLengthRange.Long]: { $gt: 140 },
};

export enum RateAttitude {
  Positive = "positive_comments",
  Neutral = "neutral_comments",
  Negative = "negative_comments",
}

const RateAttitudeMap: Record<RateAttitude, IRateListQuery["filter"]["rate"]> = {
  [RateAttitude.Positive]: { $gt: 6 },
  [RateAttitude.Neutral]: { $gte: 4, $lte: 6 },
  [RateAttitude.Negative]: { $gte: 1, $lt: 4 },
};

const EMPTY_VALUE = "__all__";

const selectedTriggerClassName =
  "bg-primary/10 border-primary/50 text-primary hover:bg-primary/20";

interface RateFilterSelectorProps {
  filter: Partial<IRateListQuery["filter"]>;
  onChange: (filter: Partial<IRateListQuery["filter"]>) => void;
  className?: string;
}

export const RateFilterSelector: React.FC<RateFilterSelectorProps> = ({
  filter = {},
  onChange,
  className,
}) => {
  const { t } = useTranslation();

  // Derive current states from filter
  const remarkLengthRange = React.useMemo(() => {
    const range = filter.remarkLength;
    if (!range?.$gt) return undefined;
    if (range.$gt === 1 && !range.$lte) return RemarkLengthRange.All;
    if (range.$gt === 1 && range.$lte === 140) return RemarkLengthRange.Short;
    if (range.$gt === 140) return RemarkLengthRange.Long;
    return undefined;
  }, [filter.remarkLength]);

  const rateAttitude = React.useMemo(() => {
    const range = filter.rate;
    if (range?.$gt === 6) return RateAttitude.Positive;
    if (range?.$gte === 4 && range?.$lte === 6) return RateAttitude.Neutral;
    if (range?.$lt === 4) return RateAttitude.Negative;
    return undefined;
  }, [filter.rate]);

  const rateView = filter.view != null ? RateViewReverseMap[filter.view] : undefined;

  const handleRemarkLengthChange = (value: string) => {
    if (value === EMPTY_VALUE) {
      onChange({ ...filter, remarkLength: undefined });
    } else {
      onChange({ ...filter, remarkLength: RemarkLengthRangeMap[value as RemarkLengthRange] });
    }
  };

  const handleAttitudeChange = (value: string) => {
    if (value === EMPTY_VALUE) {
      onChange({ ...filter, rate: undefined });
    } else {
      onChange({ ...filter, rate: RateAttitudeMap[value as RateAttitude] });
    }
  };

  const handleViewChange = (value: string) => {
    if (value === EMPTY_VALUE) {
      onChange({ ...filter, view: undefined });
    } else {
      onChange({ ...filter, view: RateViewMap[value as RateView] });
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Remark Length Select */}
      <Select
        value={remarkLengthRange ?? EMPTY_VALUE}
        onValueChange={handleRemarkLengthChange}
      >
        <SelectTrigger
          className={cn(remarkLengthRange && selectedTriggerClassName)}
        >
          <SelectValue placeholder={t("Rate.filter_remark_length")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={EMPTY_VALUE}>{t("Rate.filter_remark_length")}</SelectItem>
          {Object.values(RemarkLengthRange).map((v) => (
            <SelectItem key={v} value={v}>
              {t(`Rate.${v}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Attitude Select */}
      <Select
        value={rateAttitude ?? EMPTY_VALUE}
        onValueChange={handleAttitudeChange}
      >
        <SelectTrigger
          className={cn(rateAttitude && selectedTriggerClassName)}
        >
          <SelectValue placeholder={t("Rate.filter_rating")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={EMPTY_VALUE}>{t("Rate.filter_rating")}</SelectItem>
          {Object.values(RateAttitude).map((v) => (
            <SelectItem key={v} value={v}>
              {t(`Rate.${v}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* View Select */}
      <Select
        value={rateView ?? EMPTY_VALUE}
        onValueChange={handleViewChange}
      >
        <SelectTrigger
          className={cn(rateView && selectedTriggerClassName)}
        >
          <SelectValue placeholder={t("Rate.filter_rate_view")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={EMPTY_VALUE}>{t("Rate.filter_rate_view")}</SelectItem>
          {Object.values(RateView).map((v) => (
            <SelectItem key={v} value={v}>
              {t(`Rate.${v}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
