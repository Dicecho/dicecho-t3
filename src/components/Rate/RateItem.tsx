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
import { useSession } from "next-auth/react";
import { MessageCircle, Edit, Trash2, Loader2, Languages, ThumbsUp, ThumbsDown, Laugh, EyeOff, AlertTriangle, MoreHorizontal } from "lucide-react";
import { ShareButton } from "@/components/ui/share-button";
import { RateEditDialog } from "./RateEditDialog";
import { RateDeleteDialog } from "./RateDeleteDialog";
import { RateBlockDialog } from "./RateBlockDialog";
import { RateSpoilerReportDialog } from "./RateSpoilerReportDialog";
import { useRateTranslation } from "./use-rate-translation";
import { SpoilerCollapsible } from "./spoiler-collapsible";
import { FoldableContent } from "@/components/ui/foldable-content";
import { LinkWithLng } from "@/components/Link";
import { ScenarioWidget } from "@/components/Scenario/widget";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ActionSheet,
  ActionSheetTrigger,
  ActionSheetContent,
  ActionSheetGroup,
  ActionSheetItem,
  ActionSheetClose,
} from "@/components/ui/action-sheet";
import { cn } from "@/lib/utils";
import { AuthButton } from "@/components/Auth/auth-button";
import { useReactionDeclare } from "@/hooks/use-reaction-declare";
import { useAccount } from "@/hooks/useAccount";
import { formatDistanceToNow } from "date-fns";
import { getDateFnsLocale } from "@/lib/i18n/date-fns-locale";
import { api } from "@/trpc/react";

interface IProps {
  rate: IRateDto;
  onDeleted?: () => void;
  hideComments?: boolean;
  showMod?: boolean;
  foldable?: boolean;
}

const FOLD_LIMIT = 200;
const SPOILER_LIMIT = 1;

export const RateItem: React.FunctionComponent<IProps> = ({
  rate,
  onDeleted,
  hideComments = false,
  showMod = false,
  foldable = true,
}) => {
  const { t, i18n } = useTranslation();
  const [commentVisible, setCommentVisible] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [blockOpen, setBlockOpen] = useState(false);
  const [spoilerOpen, setSpoilerOpen] = useState(false);
  const { data: session } = useSession();
  const { isAuthenticated } = useAccount();
  const utils = api.useUtils();

  // Prefill tRPC cache before navigating to detail page
  const prefillDetailCache = () => {
    // Prefill the public view cache (accessToken: undefined)
    utils.rate.detail.setData({ id: rate._id, accessToken: undefined }, rate);
  };

  const { toggle, isActive, getCount } = useReactionDeclare({
    targetName: "Rate",
    targetId: rate._id,
    initialState: {
      declareCounts: rate.declareCounts,
      declareStatus: rate.declareStatus,
    },
  });
  
  const {
    translation,
    showTranslation,
    showTranslateButton,
    isTranslated,
    isTranslating,
    translate,
    targetLanguage,
  } = useRateTranslation(rate);


  const formatDate = (date: Date) => {
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
      locale: getDateFnsLocale(i18n.language),
    });
  };


  const canEdit =
    isAuthenticated && rate.user._id === session?.user?._id;

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

    if (showTranslation && isTranslated && translation?.translatedText) {
      return (
        <RichTextPreview
          className="overflow-hidden"
          id={`rate-item-translated-${rate._id}`}
          markdown={translation.translatedText} 
        />
      );
    }

    if (rate.remarkType === RemarkContentType.Richtext) {
      return (
        <RichTextPreview
          className="overflow-hidden"
          id={`rate-item-${rate._id}`}
          value={rate.richTextState}
        />
      );
    }

    if (rate.remarkType === RemarkContentType.Markdown) {
      return (
        <RichTextPreview
          className="overflow-hidden"
          id={`rate-item-${rate._id}`}
          markdown={rate.remark} 
        />
      );
    }

    return null;
  };

  const renderContent = () => {
    if (rate.spoilerCount > SPOILER_LIMIT) {
      return (
        <SpoilerCollapsible title={t("Rate.spoiler_warning")}>
          {renderRateContent()}
        </SpoilerCollapsible>
      );
    }

    if (!foldable) {
      return renderRateContent();
    }

    const shouldFold = rate.remarkLength > FOLD_LIMIT;

    return (
      <FoldableContent
        foldable={shouldFold}
        defaultFolded={shouldFold}
        expandText={t("Rate.expand_review")}
        collapseText={t("Rate.collapse_review")}
      >
        {renderRateContent()}
      </FoldableContent>
    );
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
          <div className="text-muted-foreground text-sm">
            {formatDate(rate.rateAt)}
          </div>

          {/* Desktop: DropdownMenu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" className="ml-auto hidden h-8 w-8 md:flex">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {canEdit ? (
                <>
                  <DropdownMenuItem onSelect={() => setEditOpen(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    {t("edit")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => setDeleteOpen(true)}
                    className="text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {t("delete")}
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem onSelect={() => setSpoilerOpen(true)}>
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    {t("report_spoiler")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setBlockOpen(true)}>
                    <EyeOff className="mr-2 h-4 w-4" />
                    {t("block")}
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile: ActionSheet */}
          <ActionSheet>
            <ActionSheetTrigger asChild>
              <Button size="icon" variant="ghost" className="ml-auto h-8 w-8 md:hidden">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </ActionSheetTrigger>
            <ActionSheetContent>
              <ActionSheetGroup>
                {canEdit ? (
                  <>
                    <ActionSheetClose asChild>
                      <ActionSheetItem onClick={() => setEditOpen(true)}>
                        <Edit className="mr-2 h-4 w-4" />
                        {t("edit")}
                      </ActionSheetItem>
                    </ActionSheetClose>
                    <ActionSheetClose asChild>
                      <ActionSheetItem
                        variant="destructive"
                        onClick={() => setDeleteOpen(true)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t("delete")}
                      </ActionSheetItem>
                    </ActionSheetClose>
                  </>
                ) : (
                  <>
                    <ActionSheetClose asChild>
                      <ActionSheetItem
                        variant="destructive"
                        onClick={() => setSpoilerOpen(true)}
                      >
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        {t("report_spoiler")}
                      </ActionSheetItem>
                    </ActionSheetClose>
                    <ActionSheetClose asChild>
                      <ActionSheetItem
                        variant="destructive"
                        onClick={() => setBlockOpen(true)}
                      >
                        <EyeOff className="mr-2 h-4 w-4" />
                        {t("block")}
                      </ActionSheetItem>
                    </ActionSheetClose>
                  </>
                )}
              </ActionSheetGroup>
              <ActionSheetGroup variant="cancel">
                <ActionSheetClose asChild>
                  <ActionSheetItem>{t("cancel")}</ActionSheetItem>
                </ActionSheetClose>
              </ActionSheetGroup>
            </ActionSheetContent>
          </ActionSheet>
        </div>
      </div>

      {showMod && rate.mod && (
        <LinkWithLng href={`/scenario/${rate.mod._id}`} className="w-full">
          <ScenarioWidget scenario={rate.mod} variant="compact" />
        </LinkWithLng>
      )}

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

      {renderContent()}

      <>
        <div className="flex flex-wrap gap-2">
          <AuthButton
            size="sm"
            variant="secondary"
            onClick={() => toggle("like")}
            className={cn("gap-2", isActive("like") && "text-primary")}
          >
            <ThumbsUp className={cn("h-4 w-4", isActive("like") && "fill-current")} />
            <span>{getCount("like")}</span>
          </AuthButton>

          <AuthButton
            size="sm"
            variant="secondary"
            onClick={() => toggle("dislike")}
            className={cn("gap-2", isActive("dislike") && "text-destructive")}
          >
            <ThumbsDown className={cn("h-4 w-4", isActive("dislike") && "fill-current")} />
          </AuthButton>

          <AuthButton
            size="sm"
            variant="secondary"
            onClick={() => toggle("happy")}
            className={cn("gap-2", isActive("happy") && "text-yellow-500")}
          >
            <Laugh className="h-4 w-4" />
            {getCount("happy") > 0 && (
              <span>{getCount("happy")}</span>
            )}
          </AuthButton>

          {!hideComments && (
            <>
              {/* Mobile: Link to detail page */}
              <LinkWithLng
                href={`/rate/${rate._id}`}
                className="md:hidden"
                onClick={prefillDetailCache}
              >
                <Button size="sm" variant="secondary" className="gap-1">
                  <MessageCircle className="h-4 w-4" />
                  {rate.commentCount > 0 && (
                    <span>{rate.commentCount}</span>
                  )}
                </Button>
              </LinkWithLng>

              {/* Desktop: Expand comment section */}
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setCommentVisible((prev) => !prev)}
                className="hidden gap-1 md:inline-flex"
              >
                <MessageCircle className="h-4 w-4" />
                {rate.commentCount > 0 && (
                  <span>{rate.commentCount}</span>
                )}
              </Button>
            </>
          )}

          <ShareButton url={rateUrl} variant="secondary" size="sm" />
          {showTranslateButton && (
            <Button
              size="sm"
              variant="secondary"
              onClick={translate}
              disabled={isTranslating}
              className="gap-2"
            >
              {isTranslating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Languages className="h-4 w-4" />
              )}
              <span>
                {isTranslated
                  ? t("Rate.show_original")
                  : t("Rate.translate_to", { language: t(`language_codes.${targetLanguage}`) })}
              </span>
            </Button>
          )}
        </div>
        {!hideComments && commentVisible && (
          <CommentSection
            targetName="Rate"
            targetId={rate._id}
            className="mt-2 hidden md:block"
          />
        )}
      </>

      {/* Controlled Dialogs */}
      <RateEditDialog rate={rate} open={editOpen} onOpenChange={setEditOpen} />
      <RateDeleteDialog
        rate={rate}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onSuccess={onDeleted}
      />
      <RateBlockDialog
        rate={rate}
        open={blockOpen}
        onOpenChange={setBlockOpen}
        onSuccess={onDeleted}
      />
      <RateSpoilerReportDialog
        rate={rate}
        open={spoilerOpen}
        onOpenChange={setSpoilerOpen}
      />
    </div>
  );
};

export default RateItem;
