"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useDicecho } from "@/hooks/useDicecho";
import { useTranslation } from "@/lib/i18n/react";
import { cn } from "@/lib/utils";
import { Loader2Icon } from "lucide-react";

enum ReportClassification {
  Illegal = "illegal",
  Pornographic = "pornographic",
  Gamble = "gamble",
  PersonalAttack = "personalattack",
  Privacy = "privacy",
}

const LAW_TYPES = [
  ReportClassification.Illegal,
  ReportClassification.Pornographic,
  ReportClassification.Gamble,
] as const;

const PERSONAL_TYPES = [
  ReportClassification.PersonalAttack,
  ReportClassification.Privacy,
] as const;

const CLASSIFICATION_I18N_MAP: Record<ReportClassification, string> = {
  [ReportClassification.Illegal]: "report_illegal",
  [ReportClassification.Pornographic]: "report_pornographic",
  [ReportClassification.Gamble]: "report_gamble",
  [ReportClassification.PersonalAttack]: "report_personal_attack",
  [ReportClassification.Privacy]: "report_privacy",
};

interface ScenarioReportDialogProps {
  scenarioId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ScenarioReportDialog({
  scenarioId,
  open,
  onOpenChange,
}: ScenarioReportDialogProps) {
  const { t } = useTranslation();
  const { api } = useDicecho();

  const [classification, setClassification] = useState<
    ReportClassification | undefined
  >();
  const [reason, setReason] = useState("");

  const mutation = useMutation({
    mutationFn: () =>
      api.report.submit({
        targetName: "Mod",
        targetId: scenarioId,
        classification: classification!,
        reason,
      }),
    onSuccess: () => {
      toast.success(t("report_success"));
      onOpenChange(false);
      setClassification(undefined);
      setReason("");
    },
    onError: () => {
      toast.error(t("error"));
    },
  });

  const handleSubmit = () => {
    if (!classification) {
      toast.info(t("report_select_reason"));
      return;
    }
    if (!reason.trim()) {
      toast.info(t("report_fill_reason"));
      return;
    }
    mutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>{t("scenario_report_title")}</DialogTitle>
          <DialogDescription>{t("scenario_report_message")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Legal violations */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">
              {t("report_category_law")}
            </Label>
            <div className="flex flex-wrap gap-2">
              {LAW_TYPES.map((type) => (
                <Button
                  key={type}
                  type="button"
                  variant={classification === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setClassification(type)}
                  className={cn(
                    classification === type &&
                      "ring-2 ring-primary ring-offset-2"
                  )}
                >
                  {t(CLASSIFICATION_I18N_MAP[type])}
                </Button>
              ))}
            </div>
          </div>

          {/* Personal rights violations */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">
              {t("report_category_personal")}
            </Label>
            <div className="flex flex-wrap gap-2">
              {PERSONAL_TYPES.map((type) => (
                <Button
                  key={type}
                  type="button"
                  variant={classification === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setClassification(type)}
                  className={cn(
                    classification === type &&
                      "ring-2 ring-primary ring-offset-2"
                  )}
                >
                  {t(CLASSIFICATION_I18N_MAP[type])}
                </Button>
              ))}
            </div>
          </div>

          {/* Reason textarea */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">
              {t("report_reason_label")}
            </Label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={t("report_reason_placeholder")}
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={mutation.isPending}
            className="w-full"
          >
            {mutation.isPending ? <Loader2Icon className="animate-spin" /> : t("report_submit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
