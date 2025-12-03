"use client";
import React, { useState } from "react";
import { UserAvatar } from "@/components/User/Avatar";
import { UserAvatarPopover } from "@/components/User/UserAvatarPopover";
import { RateView, RateType, RemarkContentType } from "@dicecho/types";
import type { IRateDto } from "@dicecho/types";
import { formatDate } from "@/utils/time";
import { RichTextPreview } from "@/components/Editor";
import { Rate } from "@/components/ui/rate";
import { Trans } from "react-i18next";
import { useTranslation } from "@/lib/i18n/react";
import { Badge } from "@/components/ui/badge";
import { CommentSection } from "@/components/Comment";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface IProps {
  rate: IRateDto;
}

export const RateItem: React.FunctionComponent<IProps> = ({ rate }) => {
  const { t } = useTranslation();
  const [commentVisible, setCommentVisible] = useState(false);

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

    if (rate.remarkType === RemarkContentType.Markdown) {
      return (
        <RichTextPreview id={`rate-item-${rate._id}`} markdown={rate.remark} />
      );
    }

    return null;
  };

  return (
    <div className={"flex flex-col gap-4"}>
      <div className={"flex items-center gap-2"}>
        <UserAvatarPopover userId={rate.user._id}>
          <UserAvatar
            className="h-6 w-6 cursor-pointer rounded-full"
            user={rate.user}
          />
        </UserAvatarPopover>
        <div className="flex flex-1 items-baseline gap-2">
          <div>{rate.user.nickName}</div>
          <div className="text-muted-foreground text-sm">
            {rate.type === RateType.Rate
              ? t("Rate.type_rate")
              : t("Rate.type_mark")}
          </div>
          <div className="text-muted-foreground ml-auto text-sm">
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
            <Badge variant="muted">{RATE_VIEW_MAP[rate.view]}</Badge>
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

      <>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={"secondary"}
            onClick={() => setCommentVisible((prev) => !prev)}
            className="gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            <span>{t("comments")}</span>
            {rate.commentCount > 0 && (
              <Badge variant="muted">
                {rate.commentCount}
              </Badge>
            )}
          </Button>
        </div>
        {commentVisible && (
          <CommentSection
            targetName="Rate"
            targetId={rate._id}
            className="mt-2"
          />
        )}
      </>
    </div>
  );
};

export default RateItem;
