"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Sortable, SortableItem, SortableItemHandle } from "@/components/ui/sortable";
import { useDicecho } from "@/hooks/useDicecho";
import { toast } from "@/components/ui/use-toast";
import { useTranslation } from "@/lib/i18n/react";
import { GripVertical, Star } from "lucide-react";
import type { IModDto } from "@dicecho/types";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface CollectionItemsListProps {
  collectionId: string;
  items: IModDto[];
  canEdit: boolean;
  isEditMode: boolean;
}

export const CollectionItemsList = ({
  collectionId,
  items,
  canEdit,
  isEditMode,
}: CollectionItemsListProps) => {
  const { api } = useDicecho();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [localItems, setLocalItems] = useState(items);

  // Sync with server data when items change
  useEffect(() => {
    setLocalItems(items);
  }, [items]);

  const updateOrderMutation = useMutation({
    mutationFn: async (newItems: IModDto[]) => {
      const orderedItems = newItems.map((item) => ({
        targetName: "Mod",
        targetId: item._id,
      }));
      return api.collection.update(collectionId, { items: orderedItems } as any);
    },
    onSuccess: () => {
      toast({ title: t("collection_order_updated") });
      queryClient.invalidateQueries({
        queryKey: ["collection", "items", collectionId],
      });
      queryClient.invalidateQueries({
        queryKey: ["collection", "detail", collectionId],
      });
    },
    onError: (error: Error) => {
      toast({
        title: t("error"),
        description: error.message,
        variant: "destructive",
      });
      // Revert to original order on error
      setLocalItems(items);
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (modId: string) => {
      const remainingItems = localItems
        .filter((item) => item._id !== modId)
        .map((item) => ({
          targetName: "Mod",
          targetId: item._id,
        }));
      return api.collection.update(collectionId, { items: remainingItems } as any);
    },
    onSuccess: () => {
      toast({ title: t("collection_item_removed") });
      queryClient.invalidateQueries({
        queryKey: ["collection", "items", collectionId],
      });
      queryClient.invalidateQueries({
        queryKey: ["collection", "detail", collectionId],
      });
    },
    onError: (error: Error) => {
      toast({
        title: t("error"),
        description: error.message,
        variant: "destructive",
      });
      setLocalItems(items);
    },
  });

  const handleReorder = (newItems: IModDto[]) => {
    setLocalItems(newItems);
    updateOrderMutation.mutate(newItems);
  };

  const handleRemove = (modId: string) => {
    setLocalItems((prev) => prev.filter((item) => item._id !== modId));
    removeMutation.mutate(modId);
  };

  if (!canEdit || !isEditMode) {
    // Non-editable: simple vertical list
    return (
      <div className="space-y-3">
        {localItems.map((mod) => (
          <Link
            key={mod._id}
            href={`/scenario/${mod._id}`}
            className="flex gap-4 p-3 bg-muted rounded-lg hover:bg-muted/50 transition-colors"
          >
            {/* Cover Image */}
            <div className="flex-none w-24 h-32 relative rounded-md overflow-hidden bg-muted">
              {mod.coverUrl ? (
                <Image
                  src={mod.coverUrl}
                  alt={mod.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  No Cover
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 space-y-1">
              <h3 className="font-medium text-base line-clamp-1">
                {mod.title}
              </h3>

              {/* Rating */}
              {mod.rateAvg !== 0 && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{mod.rateAvg.toFixed(1)}</span>
                  {mod.rateCount && (
                    <span className="text-xs">({mod.rateCount})</span>
                  )}
                </div>
              )}

              {/* Description */}
              <p className="text-sm text-muted-foreground line-clamp-2">
                {mod.description || t("no_description")}
              </p>
            </div>
          </Link>
        ))}
      </div>
    );
  }

  // Editable: vertical sortable list with remove buttons
  return (
    <Sortable
      value={localItems}
      onValueChange={handleReorder}
      getItemValue={(item) => item._id}
      className="space-y-3"
    >
      {localItems.map((mod) => (
        <SortableItem
          key={mod._id}
          value={mod._id}
          className="flex gap-4 p-3 border rounded-lg bg-card"
        >
          {/* Drag Handle */}
          <SortableItemHandle className="flex-none flex items-start pt-2">
            <div className="cursor-grab active:cursor-grabbing p-1 hover:bg-accent rounded">
              <GripVertical className="h-5 w-5 text-muted-foreground" />
            </div>
          </SortableItemHandle>

          {/* Cover Image */}
          <Link
            href={`/scenario/${mod._id}`}
            className="flex-none w-24 h-32 relative rounded-md overflow-hidden bg-muted hover:opacity-80 transition-opacity"
          >
            {mod.coverUrl ? (
              <Image
                src={mod.coverUrl}
                alt={mod.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                No Cover
              </div>
            )}
          </Link>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-1">
            <Link
              href={`/scenario/${mod._id}`}
              className="block hover:underline"
            >
              <h3 className="font-medium text-base line-clamp-1">
                {mod.title}
              </h3>
            </Link>

            {/* Rating */}
            {mod.rateAvg && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{mod.rateAvg.toFixed(1)}</span>
                {mod.rateCount && (
                  <span className="text-xs">({mod.rateCount})</span>
                )}
              </div>
            )}

            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-2">
              {mod.description || t("no_description")}
            </p>
          </div>

          {/* Remove Button */}
          <div className="flex-none flex items-start pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemove(mod._id)}
              disabled={removeMutation.isPending}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              {t("remove")}
            </Button>
          </div>
        </SortableItem>
      ))}
    </Sortable>
  );
};
