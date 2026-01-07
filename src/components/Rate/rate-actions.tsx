"use client";

import { useState } from "react";
import { MoreVerticalIcon, AlertTriangle, EyeOff, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ActionSheet,
  ActionSheetTrigger,
  ActionSheetContent,
  ActionSheetGroup,
  ActionSheetItem,
  ActionSheetClose,
} from "@/components/ui/action-sheet";
import { useTranslation } from "@/lib/i18n/react";
import { ShareButton } from "@/components/ui/share-button";
import { RateEditDialog } from "./RateEditDialog";
import { RateDeleteDialog } from "./RateDeleteDialog";
import { RateBlockDialog } from "./RateBlockDialog";
import { RateSpoilerReportDialog } from "./RateSpoilerReportDialog";
import { useSession } from "next-auth/react";
import { useAccount } from "@/hooks/useAccount";
import type { IRateDto } from "@dicecho/types";

interface RateActionsProps {
  rate: IRateDto;
  onDeleted?: () => void;
}

export function RateActions({ rate, onDeleted }: RateActionsProps) {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const { isAuthenticated } = useAccount();

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [blockOpen, setBlockOpen] = useState(false);
  const [spoilerOpen, setSpoilerOpen] = useState(false);

  const canEdit = isAuthenticated && rate.user._id === session?.user?._id;

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/rate/${rate._id}`
      : `https://dicecho.com/rate/${rate._id}`;

  return (
    <>
      <ActionSheet>
        <ActionSheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVerticalIcon size={20} />
          </Button>
        </ActionSheetTrigger>
        <ActionSheetContent>
          <ActionSheetGroup>
            <ShareButton url={shareUrl} asChild>
              <ActionSheetItem>{t("share")}</ActionSheetItem>
            </ShareButton>
            {canEdit && (
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
            )}
            {!canEdit && (
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
    </>
  );
}
