"use client";

import { PropsWithChildren, useState } from "react";
import { RateView as RateViewFilter } from "@dicecho/types";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useTranslation } from "@/lib/i18n/react";
import { isEqual } from "lodash";
import type { IRateListQuery } from "@dicecho/types";

export enum RateView {
  PL = "view_pl",
  KP = "view_kp",
  OB = "view_ob",
}

const RateViewMap: Record<RateView, RateViewFilter> = {
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

interface RateFilterDrawerProps {
  filter: Partial<IRateListQuery["filter"]>;
  onChange: (filter: Partial<IRateListQuery["filter"]>) => void;
}

export function RateFilterDrawer({
  filter,
  onChange,
  children,
}: PropsWithChildren<RateFilterDrawerProps>) {
  const { t } = useTranslation();
  const [pendingFilter, setPendingFilter] = useState(filter);

  // Derive current states
  const getRemarkLengthRange = (f: typeof filter) => {
    const range = f.remarkLength;
    if (!range?.$gt) return undefined;
    if (range.$gt === 1 && !range.$lte) return RemarkLengthRange.All;
    if (range.$gt === 1 && range.$lte === 140) return RemarkLengthRange.Short;
    if (range.$gt === 140) return RemarkLengthRange.Long;
    return undefined;
  };

  const getRateAttitude = (f: typeof filter) => {
    const range = f.rate;
    if (range?.$gt === 6) return RateAttitude.Positive;
    if (range?.$gte === 4 && range?.$lte === 6) return RateAttitude.Neutral;
    if (range?.$lt === 4) return RateAttitude.Negative;
    return undefined;
  };

  const getRateView = (f: typeof filter) => {
    return f.view != null ? RateViewReverseMap[f.view] : undefined;
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setPendingFilter(filter);
    } else {
      if (!isEqual(pendingFilter, filter)) {
        onChange(pendingFilter);
      }
    }
  };

  const handleReset = () => {
    setPendingFilter({
      ...pendingFilter,
      remarkLength: undefined,
      rate: undefined,
      view: undefined,
    });
  };

  const remarkLengthRange = getRemarkLengthRange(pendingFilter);
  const rateAttitude = getRateAttitude(pendingFilter);
  const rateView = getRateView(pendingFilter);

  return (
    <Drawer direction="right" onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="top-0 right-0 bottom-auto left-auto mt-0 h-full w-[75vw] max-w-[320px] overflow-hidden rounded-none border-0">
        <DrawerHeader>
          <DrawerTitle>{t("filter")}</DrawerTitle>
        </DrawerHeader>
        <div className="flex flex-col gap-4 flex-1 overflow-y-auto px-4 pb-4">
          {/* Remark Length */}
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">
              {t("Rate.filter_remark_length")}
            </div>
            <ButtonGroup orientation="vertical" className="w-full">
              {Object.values(RemarkLengthRange).map((v) => (
                <Button
                  key={v}
                  type="button"
                  variant={remarkLengthRange === v ? "default" : "outline"}
                  onClick={() =>
                    setPendingFilter({
                      ...pendingFilter,
                      remarkLength:
                        remarkLengthRange === v
                          ? undefined
                          : RemarkLengthRangeMap[v],
                    })
                  }
                  className="justify-start"
                >
                  {t(`Rate.${v}`)}
                </Button>
              ))}
            </ButtonGroup>
          </div>

          {/* Rating Attitude */}
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">
              {t("Rate.filter_rating")}
            </div>
            <ButtonGroup orientation="vertical" className="w-full">
              {Object.values(RateAttitude).map((v) => (
                <Button
                  key={v}
                  type="button"
                  variant={rateAttitude === v ? "default" : "outline"}
                  onClick={() =>
                    setPendingFilter({
                      ...pendingFilter,
                      rate:
                        rateAttitude === v ? undefined : RateAttitudeMap[v],
                    })
                  }
                  className="justify-start"
                >
                  {t(`Rate.${v}`)}
                </Button>
              ))}
            </ButtonGroup>
          </div>

          {/* Rate View */}
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">
              {t("Rate.filter_rate_view")}
            </div>
            <ButtonGroup orientation="vertical" className="w-full">
              {Object.values(RateView).map((v) => (
                <Button
                  key={v}
                  type="button"
                  variant={rateView === v ? "default" : "outline"}
                  onClick={() =>
                    setPendingFilter({
                      ...pendingFilter,
                      view: rateView === v ? undefined : RateViewMap[v],
                    })
                  }
                  className="justify-start"
                >
                  {t(`Rate.${v}`)}
                </Button>
              ))}
            </ButtonGroup>
          </div>

          {/* Reset Button */}
          <Button
            className="w-full capitalize mt-auto"
            type="button"
            variant="outline"
            onClick={handleReset}
          >
            {t("reset_filter")}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
