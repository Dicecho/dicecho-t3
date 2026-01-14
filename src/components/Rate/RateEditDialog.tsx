"use client";

import { useState, type PropsWithChildren } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useIsMobile } from "@/hooks/use-is-mobile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { toast } from "sonner";
import { useDicecho } from "@/hooks/useDicecho";
import { type IRateDto, RemarkContentType } from "@dicecho/types";
import { useTranslation } from "@/lib/i18n/react";
import { RateForm, RateFormValues } from "./RateForm";

interface RateEditDialogProps {
  rate?: IRateDto;
  modId?: string;
  onSuccess?: (rate: IRateDto) => void;
  onDelete?: () => void;
  isDeleting?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function RateEditDialog({
  rate,
  modId,
  onSuccess,
  onDelete,
  isDeleting: externalIsDeleting,
  open: controlledOpen,
  onOpenChange,
  children,
}: PropsWithChildren<RateEditDialogProps>) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const setOpen = isControlled ? (onOpenChange ?? (() => {})) : setUncontrolledOpen;
  const { api } = useDicecho();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  // Use external delete handler if isDeleting is provided (indicates external control)
  const useExternalDelete = externalIsDeleting !== undefined;

  const internalDeleteMutation = useMutation({
    mutationFn: async () => {
      if (!rate) {
        throw new Error("rate is required for deleting");
      }
      return api.rate.delete(rate._id);
    },
    onSuccess: () => {
      toast.success(t("rate_deleted"));
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["rate"] });
      onDelete?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || t("error"));
    },
  });

  const handleDelete = () => {
    if (useExternalDelete) {
      onDelete?.();
      setOpen(false);
    } else {
      internalDeleteMutation.mutate();
    }
  };

  const isDeleting = useExternalDelete
    ? externalIsDeleting
    : internalDeleteMutation.isPending;

  const mutation = useMutation({
    mutationFn: async (values: RateFormValues) => {
      if (rate) {
        return api.rate.update(rate._id, {
          rate: values.rate,
          remark: values.remark,
          remarkType: RemarkContentType.Markdown,
          type: values.type,
          view: values.view,
          isAnonymous: values.isAnonymous,
          accessLevel: values.accessLevel,
        });
      }
      if (!modId) {
        throw new Error("modId is required for creating rate");
      }
      return api.rate.create(modId, {
        rate: values.rate,
        remark: values.remark ?? "",
        remarkType: RemarkContentType.Markdown,
        type: values.type,
        view: values.view,
        isAnonymous: values.isAnonymous,
        accessLevel: values.accessLevel,
      });
    },
    onSuccess: (data) => {
      toast.success(t(rate ? "rate_updated" : "rate_created"));
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["rate"] });
      onSuccess?.(data);
    },
    onError: (error: Error) => {
      toast.error(error.message || t("error"));
    },
  });

  const handleSubmit = (values: RateFormValues) => {
    mutation.mutate(values);
  };

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        {!isControlled && <DrawerTrigger asChild>{children}</DrawerTrigger>}
        <DrawerContent>
          <DrawerHeader className="hidden">
            <DrawerTitle>{t(rate ? "edit_rate" : "create_rate")}</DrawerTitle>
          </DrawerHeader>
          <div className="p-4">
            <RateForm
              rate={rate}
              onSubmit={handleSubmit}
              onDelete={handleDelete}
              isSubmitting={mutation.isPending}
              isDeleting={isDeleting}
            />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isControlled && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-[600px]" showCloseButton={false}>
        <DialogHeader className="hidden">
          <DialogTitle>{t(rate ? "edit_rate" : "create_rate")}</DialogTitle>
        </DialogHeader>
        <RateForm
          rate={rate}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
          isSubmitting={mutation.isPending}
          isDeleting={isDeleting}
        />
      </DialogContent>
    </Dialog>
  );
}
