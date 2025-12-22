"use client";
import React, { useState, useEffect, useMemo } from "react";
import { franc } from 'franc-min';
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
import { useSession } from "next-auth/react";
import { MessageCircle, Edit, Trash2 } from "lucide-react";
import { ShareButton } from "@/components/ui/share-button";
import { RateEditDialog } from "./RateEditDialog";
import { RateDeleteDialog } from "./RateDeleteDialog";
import { RateTranslateButton, type TranslationResult } from "./rate-translate-button";
import { isDifferentLanguage } from "@/utils/language";

interface IProps {
  rate: IRateDto;
  onDeleted?: () => void;
}

export const RateItem: React.FunctionComponent<IProps> = ({
  rate,
  onDeleted,
}) => {
  const { t, i18n: { language } } = useTranslation();
  const [commentVisible, setCommentVisible] = useState(false);
  const [translation, setTranslation] = useState<TranslationResult | null>(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [showTranslateButton, setShowTranslateButton] = useState(false);

  const detectedLang = useMemo(() => {
    if (rate.remarkLength === 0) {
      return null;
    }

    let rateContent = "";
    if (rate.remarkType === RemarkContentType.Markdown) {
      rateContent = rate.remark || "";
    } else if (rate.remarkType === RemarkContentType.Richtext) {
      // combine text from rich text state (platejs format)
      const texts: string[] = [];
      const traverse = (nodes: any[]) => {
        nodes.forEach((node) => {
          if (typeof node.text === "string") {
            texts.push(node.text);
          }
          if (typeof node.summary === "string") {
            texts.push(node.summary);
          }
          if (node.children && Array.isArray(node.children)) {
            traverse(node.children);
          }
        });
      };
      traverse(rate.richTextState || []);
      rateContent = texts.join(" ");
    }

    return franc(rateContent, { minLength: 3 });
  }, [rate.remarkLength, rate.remarkType, rate.remark, rate.richTextState]);

  useEffect(() => {
    if (rate.remarkLength === 0) {
      return;
    }
    if (translation) {
      return;
    }

    if (isDifferentLanguage(detectedLang, language)) {
      setShowTranslateButton(true);
    } else {
      setShowTranslateButton(false);
    }
  }, [rate.remarkLength, translation, language, detectedLang]);

  const { data: session, status } = useSession();
  const canEdit =
    status === "authenticated" && rate.user._id === session?.user?._id;

  const rateUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/rate/${rate._id}`
      : `https://dicecho.com/rate/${rate._id}`;

  const RATE_VIEW_MAP = {
    [RateView.PL]: t("Rate.view_pl"),
    [RateView.KP]: t("Rate.view_kp"),
    [RateView.OB]: t("Rate.view_ob"),
  };

  const renderRateContent = () => {
    if (rate.remarkLength === 0) {
      return null;
    }

    if (showTranslation && translation && translation.translatedText) {
      return (
        <RichTextPreview
          id={`rate-item-translated-${rate._id}`}
          markdown={translation.translatedText}
        />
      );
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
        <div className="flex flex-1 items-center gap-2">
          <UserAvatarPopover userId={rate.user._id}>
            <div className="flex items-center gap-2">
              <UserAvatar
                className="h-6 w-6 cursor-pointer rounded-full"
                user={rate.user}
              />
              <div>{rate.user.nickName}</div>
            </div>
          </UserAvatarPopover>
          <div className="text-muted-foreground">
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
        <div className="flex justify-between">
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
          {showTranslation && translation &&
            <Badge variant="outline" className="text-xs">
              {t("Rate.translated")}
            </Badge>
          }
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
              <Badge variant="muted">{rate.commentCount}</Badge>
            )}
          </Button>

          <ShareButton url={rateUrl} variant="secondary" size="sm">
            {t("share")}
          </ShareButton>
          {
            showTranslateButton && (
              <RateTranslateButton
                rateId={rate._id}
                hasContent={rate.remarkLength > 0}
                isTranslated={showTranslation && translation !== null}
                onTranslated={(result) => {
                  setTranslation(result);
                  setShowTranslation(true);
                }}
                onToggle={() => setShowTranslation((prev) => !prev)}
              />
            )
          }
          
          {canEdit && (
            <>
              <RateEditDialog rate={rate}>
                <Button size="sm" variant="secondary" className="gap-2">
                  <Edit className="h-4 w-4" />
                  <span>{t("edit")}</span>
                </Button>
              </RateEditDialog>

              <RateDeleteDialog rate={rate} onSuccess={onDeleted}>
                <Button size="sm" variant="secondary" className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  <span>{t("delete")}</span>
                </Button>
              </RateDeleteDialog>
            </>
          )}
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
