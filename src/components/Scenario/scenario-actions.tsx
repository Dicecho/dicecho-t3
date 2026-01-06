"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import {
  PencilIcon,
  EyeOffIcon,
  FlagIcon,
  MoreVerticalIcon,
  FileEditIcon,
  BookmarkPlusIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthButton } from "@/components/Auth/auth-button";
import {
  ActionSheet,
  ActionSheetTrigger,
  ActionSheetContent,
  ActionSheetGroup,
  ActionSheetItem,
  ActionSheetClose,
} from "@/components/ui/action-sheet";
import { toast } from "sonner";
import { useDicecho } from "@/hooks/useDicecho";
import { useTranslation } from "@/lib/i18n/react";
import { ShareButton } from "@/components/ui/share-button";
import { CollectionActionDialog } from "@/components/Collection/collection-action-dialog";
import { ScenarioBlockDialog } from "./scenario-block-dialog";
import { ScenarioReportDialog } from "./scenario-report-dialog";

import type { IModDto } from "@dicecho/types";

interface ScenarioActionsProps {
  scenario: IModDto;
  variant?: "buttons" | "actionsheet";
}

export function ScenarioActions({
  scenario,
  variant = "buttons",
}: ScenarioActionsProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const lng = params.lng as string;
  const { api } = useDicecho();

  const [collectOpen, setCollectOpen] = useState(false);
  const [blockOpen, setBlockOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  const applyEditMutation = useMutation({
    mutationFn: () => api.module.applyEditor(scenario._id),
    onSuccess: () => {
      toast.success(t("scenario_apply_edit_success"));
      router.push(`/${lng}/scenario/${scenario._id}/edit`);
    },
    onError: () => {
      toast.error(t("error"));
    },
  });

  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/${lng}/scenario/${scenario._id}`;

  const handleCollect = () => {
    setCollectOpen(true);
  };

  if (variant === "actionsheet") {
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
              <ShareButton url={shareUrl} title={scenario.title} asChild>
                <ActionSheetItem>{t("share")}</ActionSheetItem>
              </ShareButton>
              <ActionSheetClose asChild>
                <AuthButton asChild onClick={handleCollect}>
                  <ActionSheetItem>{t("collect")}</ActionSheetItem>
                </AuthButton>
              </ActionSheetClose>
              {scenario.canEdit && (
                <ActionSheetClose asChild>
                  <ActionSheetItem asChild>
                    <Link href={`/${lng}/scenario/${scenario._id}/edit`}>
                      {t("scenario_edit")}
                    </Link>
                  </ActionSheetItem>
                </ActionSheetClose>
              )}
              {scenario.isForeign && !scenario.canEdit && (
                <AuthButton
                  asChild
                  onClick={() => applyEditMutation.mutate()}
                  disabled={applyEditMutation.isPending}
                >
                  <ActionSheetItem>{t("scenario_apply_edit")}</ActionSheetItem>
                </AuthButton>
              )}
              <AuthButton asChild onClick={() => setBlockOpen(true)}>
                <ActionSheetItem variant="destructive">{t("scenario_block")}</ActionSheetItem>
              </AuthButton>
              <AuthButton asChild onClick={() => setReportOpen(true)}>
                <ActionSheetItem variant="destructive">{t("scenario_report")}</ActionSheetItem>
              </AuthButton>
            </ActionSheetGroup>

            <ActionSheetGroup variant="cancel">
              <ActionSheetClose asChild>
                <ActionSheetItem>{t("cancel")}</ActionSheetItem>
              </ActionSheetClose>
            </ActionSheetGroup>
          </ActionSheetContent>
        </ActionSheet>
        <CollectionActionDialog
          targetName="Mod"
          targetId={scenario._id}
          open={collectOpen}
          onOpenChange={setCollectOpen}
        />
        <ScenarioBlockDialog
          scenarioId={scenario._id}
          open={blockOpen}
          onOpenChange={setBlockOpen}
        />
        <ScenarioReportDialog scenarioId={scenario._id} open={reportOpen} onOpenChange={setReportOpen} />
      </>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {scenario.canEdit && (
        <Link href={`/${lng}/scenario/${scenario._id}/edit`}>
          <Button variant="outline" className="w-full">
            <PencilIcon size={16} />
            {t("scenario_edit")}
          </Button>
        </Link>
      )}
      {scenario.isForeign && !scenario.canEdit && (
        <AuthButton
          variant="outline"
          className="w-full"
          onClick={() => applyEditMutation.mutate()}
          disabled={applyEditMutation.isPending}
        >
          <FileEditIcon size={16} />
          {t("scenario_apply_edit")}
        </AuthButton>
      )}

      <ShareButton url={shareUrl} title={scenario.title} asChild>
        <Button variant="outline" className="w-full">{t("share")}</Button>
      </ShareButton>
      <AuthButton
        variant="outline"
        className="text-destructive hover:text-destructive w-full"
        onClick={() => setBlockOpen(true)}
      >
        <EyeOffIcon size={16} />
        {t("scenario_block")}
      </AuthButton>
      <AuthButton
        variant="outline"
        className="text-destructive hover:text-destructive w-full"
        onClick={() => setReportOpen(true)}
      >
        <FlagIcon size={16} />
        {t("scenario_report")}
      </AuthButton>
      <ScenarioBlockDialog
        scenarioId={scenario._id}
        open={blockOpen}
        onOpenChange={setBlockOpen}
      />
      <ScenarioReportDialog scenarioId={scenario._id} open={reportOpen} onOpenChange={setReportOpen} />
    </div>
  );
}
