"use client";

import { useState, type PropsWithChildren } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useDicecho } from "@/hooks/useDicecho";
import type { IRateDto } from "@dicecho/types";
import { useTranslation } from "@/lib/i18n/react";

interface RateSpoilerReportDialogProps {
  rate: IRateDto;
  onSuccess?: () => void;
}

export function RateSpoilerReportDialog({
  rate,
  onSuccess,
  children,
}: PropsWithChildren<RateSpoilerReportDialogProps>) {
  const [open, setOpen] = useState(false);
  const { api } = useDicecho();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const mutation = useMutation({
    mutationFn: () => api.rate.reportSpoiler(rate._id),
    onSuccess: () => {
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["rate"] });
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || t("error"));
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("report_spoiler_confirm_title")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("report_spoiler_confirm_message")}
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
          >
            {t("confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
