"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useDicecho } from "@/hooks/useDicecho";
import { useTranslation } from "@/lib/i18n/react";

interface ScenarioBlockDialogProps {
  scenarioId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ScenarioBlockDialog({
  scenarioId,
  open,
  onOpenChange,
}: ScenarioBlockDialogProps) {
  const { api } = useDicecho();
  const router = useRouter();
  const { t } = useTranslation();

  const mutation = useMutation({
    mutationFn: () => api.block.block("Mod", scenarioId),
    onSuccess: () => {
      toast.success(t("scenario_block_success"));
      onOpenChange(false);
      router.back();
    },
    onError: () => {
      toast.error(t("error"));
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("scenario_block_confirm_title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("scenario_block_confirm_message")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              mutation.mutate();
            }}
            disabled={mutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {t("scenario_block")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
