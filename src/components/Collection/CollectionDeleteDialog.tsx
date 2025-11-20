"use client";

import { useState, type PropsWithChildren } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useDicecho } from "@/hooks/useDicecho";
import { useIsMobile } from "@/hooks/use-is-mobile";
import type { CollectionDto } from "@/types/collection";
import { useTranslation } from "@/lib/i18n/react";
import { AlertTriangle } from "lucide-react";

interface CollectionDeleteDialogProps {
  collection: CollectionDto;
  onSuccess?: () => void;
}

export function CollectionDeleteDialog({
  collection,
  onSuccess,
  children,
}: PropsWithChildren<CollectionDeleteDialogProps>) {
  const [open, setOpen] = useState(false);
  const { api } = useDicecho();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const mutation = useMutation({
    mutationFn: async () => {
      // Check if it's the default collection
      if (collection.isDefault) {
        throw new Error(t("collection_cannot_delete_default"));
      }
      return api.collection.delete(collection._id);
    },
    onSuccess: () => {
      toast({
        title: t("collection_deleted"),
      });
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["collection"] });
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast({
        title: t("error"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDelete = () => {
    mutation.mutate();
  };

  const content = (
    <div className="space-y-4">
      <div className="flex items-center gap-3 text-destructive">
        <AlertTriangle className="h-5 w-5" />
        <p className="text-sm font-medium">{t("confirm_delete_warning")}</p>
      </div>
      <p className="text-sm text-muted-foreground">
        {t("confirm_delete_collection_hint")}
      </p>
      <div className="rounded-lg bg-muted p-3">
        <p className="text-sm font-medium">{collection.name}</p>
        {collection.description && (
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
            {collection.description}
          </p>
        )}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{children}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{t("confirm_delete_collection")}</DrawerTitle>
            <DrawerDescription>
              {t("confirm_delete_collection_description")}
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4">{content}</div>
          <DrawerFooter>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? t("deleting") : t("delete")}
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)}>
              {t("cancel")}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("confirm_delete_collection")}</DialogTitle>
          <DialogDescription>
            {t("confirm_delete_collection_description")}
          </DialogDescription>
        </DialogHeader>
        {content}
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t("cancel")}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? t("deleting") : t("delete")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
