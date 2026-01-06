"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { useDicecho } from "@/hooks/useDicecho";
import { useTranslation } from "@/lib/i18n/react";
import { toast } from "sonner";
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
import { TopicForm, type TopicFormSubmitData, type SimpleModDto } from "./topic-form";
import type { ITopicDto } from "@/types/topic";

interface TopicFormDialogProps {
  children: React.ReactNode;
  topic?: ITopicDto;
  defaultRelatedMod?: SimpleModDto;
  onSuccess?: (topic: ITopicDto) => void;
}

export function TopicFormDialog({ children, topic, defaultRelatedMod, onSuccess }: TopicFormDialogProps) {
  const { api } = useDicecho();
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const lng = params.lng as string;
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const isEdit = !!topic;
  const title = isEdit ? t("topic_edit") : t("topic_create");
  const description = t("topic_create_hint");

  const mutation = useMutation({
    mutationFn: async (data: TopicFormSubmitData) => {
      if (isEdit) {
        return api.topic.update(topic._id, data);
      }
      return api.topic.create(data);
    },
    onSuccess: (data) => {
      toast.success(isEdit ? t("topic_updated") : t("topic_created"));
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["topics"] });
      onSuccess?.(data);
      if (!isEdit) {
        router.push(`/${lng}/forum/topic/${data._id}`);
      }
    },
    onError: (error: Error) => {
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
            <TopicForm
              topic={topic}
              defaultRelatedMod={defaultRelatedMod}
              onSubmit={(data) => mutation.mutate(data)}
              isPending={mutation.isPending}
              submitText={isEdit ? t("save") : t("submit_now")}
            />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[90vh] flex flex-col overflow-y-auto overflow-x-hidden sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <TopicForm
          topic={topic}
          defaultRelatedMod={defaultRelatedMod}
          onSubmit={(data) => mutation.mutate(data)}
          isPending={mutation.isPending}
          submitText={isEdit ? t("save") : t("submit_now")}
        />
      </DialogContent>
    </Dialog>
  );
}
