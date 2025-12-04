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
}

export function RateEditDialog({
  rate,
  modId,
  onSuccess,
  children,
}: PropsWithChildren<RateEditDialogProps>) {
  const [open, setOpen] = useState(false);
  const { api } = useDicecho();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const isMobile = useIsMobile();

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
        <DrawerTrigger asChild>{children}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="hidden">
            <DrawerTitle>{t(rate ? "edit_rate" : "create_rate")}</DrawerTitle>
          </DrawerHeader>
          <div className="p-4">
            <RateForm
              rate={rate}
              onSubmit={handleSubmit}
              isSubmitting={mutation.isPending}
            />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader className="hidden">
          <DialogTitle>{t(rate ? "edit_rate" : "create_rate")}</DialogTitle>
        </DialogHeader>
        <RateForm
          rate={rate}
          onSubmit={handleSubmit}
          isSubmitting={mutation.isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
