"use client";
import React from "react";
import { UserAvatar } from "@/components/User/Avatar";
import { RateView, RateType, RemarkContentType } from "@dicecho/types";
import type { IRateDto } from "@dicecho/types";
import { formatDate } from "@/utils/time";
import { RichTextPreview } from "@/components/Editor";
import { Rate } from "@/components/ui/rate";
import { Trans } from "react-i18next";
import { useTranslation } from "@/lib/i18n/react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";

interface IProps {
  rate: IRateDto;
}

export const RateItem: React.FunctionComponent<IProps> = ({ rate }) => {
  const { t } = useTranslation();

  const RATE_VIEW_MAP = {
    [RateView.PL]: t("Rate.view_pl"),
    [RateView.KP]: t("Rate.view_kp"),
    [RateView.OB]: t("Rate.view_ob"),
  };

  const renderRateContent = () => {
    if (rate.remarkLength === 0) {
      return null;
    }

    if (rate.remarkType === RemarkContentType.Richtext) {
      return (
        <RichTextPreview
          id={`rate-item-${rate._id}`}
          value={rate.richTextState}
        />
      );
    }

    // if (rate.remarkType === RemarkContentType.Markdown) {
      // const markdownValue = toSlate(rate.remark)
      
      // // (() => {
      // //   // const splitValue = rate.remark.split(/\r?\n/);

      // //   return splitValue.map((item) => ());
      // // })();

      // return (
      //   <RichTextPreview id={`rate-item-${rate._id}`} value={markdownValue} />
      // );
    // }

    return null;
  };

  return (
    <Card className={"flex flex-col gap-4 p-4"}>
      <div className={"flex items-center gap-2"}>
        <UserAvatar
          className="rounded-full"
          user={rate.user}
          alt="user avatar"
          width={24}
          height={24}
        />
        <div className="flex flex-1 items-baseline gap-2">
          <div>{rate.user.nickName}</div>
          <div className="text-sm text-muted-foreground">
            {rate.type === RateType.Rate
              ? t("Rate.type_rate")
              : t("Rate.type_mark")}
          </div>
          <div className="ml-auto text-sm text-muted-foreground">
            {formatDate(new Date(rate.rateAt).getTime())}
          </div>
        </div>
      </div>

      {rate.type === RateType.Rate && rate.rate > 0 && (
        <Rate value={rate.rate / 2} allowHalf readOnly />
      )}

      {(rate.type === RateType.Rate || rate.remarkLength > 50) && (
        <div className="flex gap-2">
          {rate.type === RateType.Rate && (
            <Badge variant="secondary">
              {RATE_VIEW_MAP[rate.view]}
            </Badge>
          )}
          {rate.remarkLength > 50 && (
            <Badge variant="outline">
              <Trans
                i18nKey="Rate.text_length"
                t={t}
                values={{
                  count: rate.remarkLength,
                }}
              />
            </Badge>
          )}
        </div>
      )}

      {renderRateContent()}
    </Card>
  );
};

export default RateItem;
