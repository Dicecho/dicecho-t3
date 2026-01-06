"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDicecho } from "@/hooks/useDicecho";
import { useTranslation } from "@/lib/i18n/react";
import { toast } from "sonner";
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

interface TopicDeleteDialogProps {
  topicId: string;
  children: React.ReactNode;
  onSuccess?: () => void;
}

export function TopicDeleteDialog({
  topicId,
  children,
  onSuccess,
}: TopicDeleteDialogProps) {
  const { api } = useDicecho();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      return api.topic.delete(topicId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["topics"] });
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(t("error"), { description: error.message });
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("topic_delete_confirm")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("topic_delete_confirm_desc")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {mutation.isPending ? t("deleting") : t("delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
