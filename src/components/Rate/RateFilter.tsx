"use client";
import clsx from "clsx";
import { SortOrder } from "@dicecho/types";
import { FilterIcon, ArrowDownWideNarrowIcon, XIcon } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
  SelectValue,
} from "@/components/ui/select";
import * as SelectPrimitive from "@radix-ui/react-select";
import { RateView as RateViewFilter, RateSortKey } from "@dicecho/types";
import { useTranslation } from "@/lib/i18n/react";
import { isEqual } from "lodash";

import type { IRateListQuery } from "@dicecho/types";
import type { ComponentProps, FC } from "react";

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

function isRateView(value: string): value is RateView {
  return Object.values(RateView).includes(value as RateView);
}

export enum RemarkLengthRange {
  All = "remark_length_all",
  Short = "remark_length_short",
  Long = "remark_length_long",
}

function isRemarkLengthRange(value: string): value is RemarkLengthRange {
  return Object.values(RemarkLengthRange).includes(value as RemarkLengthRange);
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

function isRateAttitude(value: string): value is RateAttitude {
  return Object.values(RateAttitude).includes(value as RateAttitude);
}

const RateAttitudeMap: Record<RateAttitude, IRateListQuery["filter"]["rate"]> =
  {
    [RateAttitude.Positive]: { $gt: 6 },
    [RateAttitude.Neutral]: { $gte: 4, $lte: 6 },
    [RateAttitude.Negative]: { $gte: 1, $lt: 4 },
  };

export enum RateSortOption {
  Recommend = "recommend_rate",
  Happiest = "happiest_rate",
  Longest = "longest_rate",
  Latest = "latest_rate",
  Oldest = "oldest_rate",
}

function isRateSortOption(value: string): value is RateSortOption {
  return Object.values(RateSortOption).includes(value as RateSortOption);
}

const RateSortOptionMap: Record<RateSortOption, IRateListQuery["sort"]> = {
  [RateSortOption.Recommend]: { [RateSortKey.WILSON_SCORE]: -1 },
  [RateSortOption.Happiest]: { [RateSortKey.HAPPY_COUNT]: -1 },
  [RateSortOption.Longest]: { [RateSortKey.REMARK_LENGTH]: -1 },
  [RateSortOption.Latest]: { [RateSortKey.RATE_AT]: -1 },
  [RateSortOption.Oldest]: { [RateSortKey.RATE_AT]: 1 },
};

interface RateFilterProps extends Omit<ComponentProps<"div">, "onChange"> {
  query: Pick<Partial<IRateListQuery>, "sort" | "filter">;
  onChange: (query: Pick<Partial<IRateListQuery>, "sort" | "filter">) => void;
}

export const RateFilter: FC<RateFilterProps> = ({
  query = {},
  onChange = () => {},
  className,
  ...props
}) => {
  const { t } = useTranslation();

  const remarkLengthRange = (() => {
    const range = query.filter?.remarkLength;

    if (!range?.$gt) return undefined;

    if (range.$gt === 1 && !range.$lte) {
      return RemarkLengthRange.All;
    }

    if (range.$gt === 1 && range.$lte === 140) {
      return RemarkLengthRange.Short;
    }

    if (range.$gt === 140) {
      return RemarkLengthRange.Long;
    }
  })();

  const rateAttitude = (() => {
    const range = query.filter?.rate;

    if (range?.$gt === 6) {
      return RateAttitude.Positive;
    }

    if (range?.$gte === 4 && range?.$lte === 6) {
      return RateAttitude.Neutral;
    }

    if (range?.$lt === 4) {
      return RateAttitude.Negative;
    }
  })();

  const rateView = (() => {
    if (query.filter?.view === RateViewFilter.PL) {
      return RateView.PL;
    }

    if (query.filter?.view === RateViewFilter.KP) {
      return RateView.KP;
    }

    if (query.filter?.view === RateViewFilter.OB) {
      return RateView.OB;
    }
  })();

  const sort = (() => {
    if (query.sort?.wilsonScore === SortOrder.DESC) {
      return RateSortOption.Recommend;
    }

    if (query.sort?.["declareCounts.happy"] === SortOrder.DESC) {
      return RateSortOption.Happiest;
    }

    if (query.sort?.remarkLength === SortOrder.DESC) {
      return RateSortOption.Longest;
    }

    if (query.sort?.rateAt === SortOrder.DESC) {
      return RateSortOption.Latest;
    }

    if (query.sort?.rateAt === SortOrder.ASC) {
      return RateSortOption.Oldest;
    }
  })();

  return (
    <div className="flex w-full flex-col gap-2">
      <div className={clsx("flex gap-2", className)} {...props}>
        <Tabs
          value={query.filter?.type?.toString() ?? "0"}
          onValueChange={(value) =>
            onChange({
              ...query,
              filter: { ...query.filter, type: parseInt(value) },
            })
          }
        >
          <TabsList>
            <TabsTrigger value="0" className="capitalize">
              {t("Rate.type_rate")}
            </TabsTrigger>
            <TabsTrigger value="1" className="capitalize">
              {t("Rate.type_mark")}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Select
          onValueChange={(value) => {
            if (isRateView(value)) {
              return onChange({
                ...query,
                filter: {
                  ...query.filter,
                  view:
                    RateViewMap[value] === query.filter?.view
                      ? undefined
                      : RateViewMap[value],
                },
              });
            }

            if (isRateAttitude(value)) {
              return onChange({
                ...query,
                filter: {
                  ...query.filter,
                  rate:
                    RateAttitudeMap[value] === query.filter?.rate
                      ? undefined
                      : RateAttitudeMap[value],
                },
              });
            }

            if (isRemarkLengthRange(value)) {
              return onChange({
                ...query,
                filter: {
                  ...query.filter,
                  remarkLength: isEqual(
                    RemarkLengthRangeMap[value],
                    query.filter?.remarkLength,
                  )
                    ? undefined
                    : RemarkLengthRangeMap[value],
                },
              });
            }
          }}
          value={""}
        >
          <SelectPrimitive.Trigger asChild>
            <Button variant="outline" className="ml-auto" size="icon">
              <FilterIcon width={16} />
            </Button>
          </SelectPrimitive.Trigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>{t("Rate.filter_remark_length")}</SelectLabel>
              {Object.values(RemarkLengthRange).map((v) => (
                <SelectItem key={v} value={v}>
                  {t(`Rate.${v}`)}
                </SelectItem>
              ))}
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>{t("Rate.filter_rating")}</SelectLabel>
              {Object.values(RateAttitude).map((v) => (
                <SelectItem key={v} value={v}>
                  {t(`Rate.${v}`)}
                </SelectItem>
              ))}
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>{t("Rate.filter_rate_view")}</SelectLabel>
              {Object.values(RateView).map((view) => (
                <SelectItem key={view} value={view}>
                  {t(`Rate.${view}`)}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) =>
            onChange({
              ...query,
              sort: isRateSortOption(value)
                ? RateSortOptionMap[value]
                : undefined,
            })
          }
          value={sort ?? ""}
        >
          <SelectPrimitive.Trigger asChild>
            <Button variant="outline">
              <ArrowDownWideNarrowIcon width={16} />
              <SelectValue />
            </Button>
          </SelectPrimitive.Trigger>
          <SelectContent>
            {Object.values(RateSortOption).map((sort) => (
              <SelectItem key={sort} value={sort}>
                {t(`Rate.${sort}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2 flex-wrap">
        {remarkLengthRange && (
          <Button
            onClick={() => {
              onChange({
                ...query,
                filter: {
                  ...query.filter,
                  remarkLength: undefined,
                },
              });
            }}
          >
            {t(`Rate.${remarkLengthRange}`)}
            <XIcon size={16} />
          </Button>
        )}
        {rateAttitude && (
          <Button
            onClick={() => {
              onChange({
                ...query,
                filter: {
                  ...query.filter,
                  rate: undefined,
                },
              });
            }}
          >
            {t(`Rate.${rateAttitude}`)}
            <XIcon size={16} />
          </Button>
        )}
        {rateView && (
          <Button
            variant="outline"
            onClick={() => {
              onChange({
                ...query,
                filter: {
                  ...query.filter,
                  view: undefined,
                },
              });
            }}
          >
            {t(`Rate.${rateView}`)}
            <XIcon size={16} />
          </Button>
        )}
      </div>
    </div>
  );
};
