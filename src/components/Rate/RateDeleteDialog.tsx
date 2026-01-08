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

interface RateDeleteDialogProps {
  rate: IRateDto;
  onSuccess?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function RateDeleteDialog({
  rate,
  onSuccess,
  open: controlledOpen,
  onOpenChange,
  children,
}: PropsWithChildren<RateDeleteDialogProps>) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const setOpen = isControlled ? (onOpenChange ?? (() => {})) : setUncontrolledOpen;
  const { api } = useDicecho();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const mutation = useMutation({
    mutationFn: () => api.rate.delete(rate._id),
    onSuccess: () => {
      toast.success(t("rate_deleted"));
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
      {!isControlled && <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("delete_rate_confirm_title")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("delete_rate_confirm_message")}
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
            className="bg-destructive hover:bg-destructive/90"
          >
            {mutation.isPending ? t("deleting") : t("delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

