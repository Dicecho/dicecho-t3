"use client";
import * as React from "react";
import { RateView as RateViewFilter } from "@dicecho/types";
import MultipleSelector, { type Option } from "@/components/ui/multiple-selector";
import { useTranslation } from "@/lib/i18n/react";
import { isEqual } from "lodash";
import type { IRateListQuery } from "@dicecho/types";

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

// Filter category prefixes for option values
const FILTER_PREFIX = {
  remarkLength: "remarkLength:",
  attitude: "attitude:",
  view: "view:",
} as const;

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

  // Build filter badges and removal handlers
  const { filterBadges, removalHandlers } = React.useMemo(() => {
    const badges: Option[] = [];
    const handlers = new Map<string, () => void>();

    if (remarkLengthRange) {
      const value = `${FILTER_PREFIX.remarkLength}${remarkLengthRange}`;
      badges.push({
        value,
        label: t(`Rate.${remarkLengthRange}`),
        group: t("Rate.filter_remark_length"),
      });
      handlers.set(value, () => onChange({ ...filter, remarkLength: undefined }));
    }

    if (rateAttitude) {
      const value = `${FILTER_PREFIX.attitude}${rateAttitude}`;
      badges.push({
        value,
        label: t(`Rate.${rateAttitude}`),
        group: t("Rate.filter_rating"),
      });
      handlers.set(value, () => onChange({ ...filter, rate: undefined }));
    }

    if (rateView) {
      const value = `${FILTER_PREFIX.view}${rateView}`;
      badges.push({
        value,
        label: t(`Rate.${rateView}`),
        group: t("Rate.filter_rate_view"),
      });
      handlers.set(value, () => onChange({ ...filter, view: undefined }));
    }

    return { filterBadges: badges, removalHandlers: handlers };
  }, [filter, remarkLengthRange, rateAttitude, rateView, onChange, t]);

  // Build available options (grouped)
  const filterOptions: Option[] = React.useMemo(() => {
    const options: Option[] = [];

    // Remark length options
    Object.values(RemarkLengthRange).forEach((v) => {
      options.push({
        value: `${FILTER_PREFIX.remarkLength}${v}`,
        label: t(`Rate.${v}`),
        group: t("Rate.filter_remark_length"),
      });
    });

    // Attitude options
    Object.values(RateAttitude).forEach((v) => {
      options.push({
        value: `${FILTER_PREFIX.attitude}${v}`,
        label: t(`Rate.${v}`),
        group: t("Rate.filter_rating"),
      });
    });

    // View options
    Object.values(RateView).forEach((v) => {
      options.push({
        value: `${FILTER_PREFIX.view}${v}`,
        label: t(`Rate.${v}`),
        group: t("Rate.filter_rate_view"),
      });
    });

    return options;
  }, [t]);

  const handleChange = (newOptions: Option[]) => {
    const oldValues = new Set(filterBadges.map((b) => b.value));
    const newValues = new Set(newOptions.map((o) => o.value));

    // Find added option (user selected from dropdown)
    const added = newOptions.find((o) => !oldValues.has(o.value));

    // Find removed option (user clicked X on badge)
    const removed = filterBadges.find((b) => !newValues.has(b.value));

    if (added) {
      // Handle selection
      const value = added.value;
      let newFilter = { ...filter };

      if (value.startsWith(FILTER_PREFIX.remarkLength)) {
        const key = value.replace(FILTER_PREFIX.remarkLength, "") as RemarkLengthRange;
        newFilter.remarkLength = RemarkLengthRangeMap[key];
      } else if (value.startsWith(FILTER_PREFIX.attitude)) {
        const key = value.replace(FILTER_PREFIX.attitude, "") as RateAttitude;
        newFilter.rate = RateAttitudeMap[key];
      } else if (value.startsWith(FILTER_PREFIX.view)) {
        const key = value.replace(FILTER_PREFIX.view, "") as RateView;
        newFilter.view = RateViewMap[key];
      }

      onChange(newFilter);
    } else if (removed) {
      // Handle removal
      removalHandlers.get(removed.value)?.();
    }
  };

  return (
    <MultipleSelector
      value={filterBadges}
      options={filterOptions}
      onChange={handleChange}
      placeholder={t("Rate.filter_placeholder")}
      hidePlaceholderWhenSelected
      hideClearAllButton={filterBadges.length === 0}
      selectFirstItem={false}
      groupBy="group"
      className={className}
    />
  );
};
