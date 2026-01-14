"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { useTranslation } from "@/lib/i18n/react";
import { api } from "@/trpc/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { FeedbackForm } from "./feedback-form";
import { trackFeedbackCreate } from "@/lib/analytics";

interface FeedbackFormDialogProps {
  children: React.ReactNode;
}

export function FeedbackFormDialog({ children }: FeedbackFormDialogProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const lng = params.lng as string;
  const utils = api.useUtils();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const title = t("feedback_submit");
  const description = t("feedback_submit_description");

  const mutation = api.feedback.create.useMutation({
    onSuccess: (data) => {
      trackFeedbackCreate();
      toast.success(t("feedback_submitted"));
      setOpen(false);
      void utils.feedback.list.invalidate();
      router.push(`/${lng}/feedback/${data.number}`);
    },
    onError: (error) => {
      toast.error(t("error"), { description: error.message });
    },
  });

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{children}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>
          <div className="max-h-[70vh] overflow-y-auto px-4 pb-4">
            <FeedbackForm
              onSubmit={(data) => mutation.mutate(data)}
              isPending={mutation.isPending}
            />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[90vh] flex flex-col overflow-y-auto sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <FeedbackForm
          onSubmit={(data) => mutation.mutate(data)}
          isPending={mutation.isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
