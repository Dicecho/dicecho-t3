"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Plus, Lock, Globe, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { useDicecho } from "@/hooks/useDicecho";
import { useTranslation } from "@/lib/i18n/react";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { cn } from "@/lib/utils";
import type { CollectionDto } from "@/types/collection";

interface CollectionItemProps {
  collection: CollectionDto;
  targetName: string;
  targetId: string;
  initialInCollection: boolean;
}

function CollectionActionItem({
  collection,
  targetName,
  targetId,
  initialInCollection,
}: CollectionItemProps) {
  const { t } = useTranslation();
  const { api } = useDicecho();
  const [isInCollection, setIsInCollection] = useState(initialInCollection);

  useEffect(() => {
    setIsInCollection(initialInCollection);
  }, [initialInCollection]);

  const addMutation = useMutation({
    mutationFn: () => api.collection.addItem(collection._id, { targetName, targetId }),
    onSuccess: () => setIsInCollection(true),
    onError: () => toast.error(t("error")),
  });

  const removeMutation = useMutation({
    mutationFn: () => api.collection.removeItem(collection._id, { targetName, targetId }),
    onSuccess: () => setIsInCollection(false),
    onError: () => toast.error(t("error")),
  });

  const isPending = addMutation.isPending || removeMutation.isPending;

  const handleClick = () => {
    if (isInCollection) {
      removeMutation.mutate();
    } else {
      addMutation.mutate();
    }
  };

  return (
    <button
      className="flex items-center w-full rounded-lg group"
      onClick={handleClick}
      disabled={isPending}
    >
      <Avatar className="h-10 w-10 rounded-md mr-3">
        <AvatarImage src={collection.coverUrl} />
        <AvatarFallback className="rounded-md">
          {collection.name[0]}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 text-left">
        <div className="flex items-center gap-2">
          <span className="font-medium group-hover:text-primary transition-colors">
            {collection.name}
          </span>
          {isPending ? (
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
            </span>
          ) : (
            <span
              className={cn(
                "flex items-center gap-1 text-sm transition-all",
                isInCollection ? "text-green-600 opacity-100" : "opacity-0"
              )}
            >
              <CheckCircle2 className="h-4 w-4" />
              {t("collected")}
            </span>
          )}
        </div>
        <div className="text-sm text-muted-foreground flex items-center gap-1">
          {collection.accessLevel === "private" ? (
            <>
              <Lock className="h-3 w-3" />
              {t("collection_private")}
            </>
          ) : (
            <>
              <Globe className="h-3 w-3" />
              {t("collection_public")}
            </>
          )}
          <span className="mx-1">·</span>
          {t("collection_item_count", { count: collection.items.length })}
        </div>
      </div>
    </button>
  );
}

interface CollectionActionDialogProps {
  targetName: string;
  targetId: string;
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CollectionActionDialog({
  targetName,
  targetId,
  children,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: CollectionActionDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = controlledOpen ?? uncontrolledOpen;
  const onOpenChange = controlledOnOpenChange ?? setUncontrolledOpen;
  const { t } = useTranslation();
  const { api } = useDicecho();
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();

  const [newCollectionName, setNewCollectionName] = useState("");

  // Fetch user's collections
  const { data: collections = [], isLoading: isLoadingCollections } = useQuery({
    queryKey: ["collections", "mine"],
    queryFn: () => api.collection.mine(),
    enabled: open,
  });

  // Fetch collection status for the target
  const { data: statusData = {} } = useQuery({
    queryKey: ["collection-status", targetName, targetId],
    queryFn: () => api.collection.status(targetName, targetId),
    enabled: open,
  });

  // Filter to editable collections only
  const editableCollections = collections.filter((c) => c.canEdit);

  // Create collection mutation
  const createMutation = useMutation({
    mutationFn: (name: string) => api.collection.create({ name }),
    onSuccess: () => {
      setNewCollectionName("");
      queryClient.invalidateQueries({ queryKey: ["collections", "mine"] });
      toast.success(t("collection_create_success"));
    },
    onError: () => {
      toast.error(t("error"));
    },
  });

  const handleCreateCollection = () => {
    if (!newCollectionName.trim()) return;
    if (newCollectionName.length > 20) {
      toast.error(t("collection_name_too_long"));
      return;
    }
    createMutation.mutate(newCollectionName.trim());
  };

  const content = (
    <div className="flex flex-col h-full">
      <ScrollArea className="max-h-[50vh] -mx-4 px-4">
        {isLoadingCollections ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center">
                <Skeleton className="h-10 w-10 rounded-md mr-3" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : editableCollections.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            {t("collection_empty")}
          </div>
        ) : (
          <div className="space-y-4">
            {editableCollections.map((collection) => (
              <CollectionActionItem
                key={collection._id}
                collection={collection}
                targetName={targetName}
                targetId={targetId}
                initialInCollection={statusData[collection._id] ?? false}
              />
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Create new collection */}
      <div className="flex items-center gap-2 pt-4 border-t mt-4">
        <div className="relative flex-1">
          <Plus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder={t("collection_create_placeholder")}
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
            maxLength={20}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleCreateCollection();
              }
            }}
          />
        </div>
        <Button
          onClick={handleCreateCollection}
          disabled={!newCollectionName.trim() || createMutation.isPending}
        >
          {createMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            t("create")
          )}
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        {children && <DrawerTrigger asChild>{children}</DrawerTrigger>}
        <DrawerContent className="max-h-[70vh]">
          <DrawerHeader>
            <DrawerTitle>{t("collection_add_to")}</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-4 flex-1 overflow-hidden">{content}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{t("collection_add_to")}</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
}
