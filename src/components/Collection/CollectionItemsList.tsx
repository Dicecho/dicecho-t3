"use client";

import { useState, useEffect, HTMLAttributes } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Sortable,
  SortableItem,
  SortableItemHandle,
} from "@/components/ui/sortable";
import { useDicecho } from "@/hooks/useDicecho";
import { toast } from "@/components/ui/use-toast";
import { useTranslation } from "@/lib/i18n/react";
import { GripVertical, Star } from "lucide-react";
import type { IModDto } from "@dicecho/types";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CollectionItemsListProps {
  collectionId: string;
  items: IModDto[];
  canEdit: boolean;
  isEditMode: boolean;
}

const CollectionItem = ({ item, className, ...props }: HTMLAttributes<HTMLDivElement> & { item: IModDto }) => {
  const { t } = useTranslation();

  return (
    <div className={cn("flex gap-4 rounded-sm p-3 transition-colors", className)} {...props}>
      {/* Cover Image */}
      <div className="relative h-32 w-24 flex-none overflow-hidden rounded-md">
        {item.coverUrl ? (
          <Image
            src={item.coverUrl}
            alt={item.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="text-muted-foreground flex h-full w-full items-center justify-center">
            No Cover
          </div>
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1 space-y-1">
        <h3 className="line-clamp-1 text-base font-medium">{item.title}</h3>

        {/* Rating */}
        {item.rateAvg !== 0 && (
          <div className="text-muted-foreground flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{item.rateAvg.toFixed(1)}</span>
            {item.rateCount && (
              <span className="text-xs">({item.rateCount})</span>
            )}
          </div>
        )}

        {/* Description */}
        <p className="text-muted-foreground line-clamp-2 text-sm">
          {item.description || t("no_description")}
        </p>
      </div>
    </div>
  );
};

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
      return api.collection.update(collectionId, {
        items: orderedItems,
      } as any);
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
      return api.collection.update(collectionId, {
        items: remainingItems,
      } as any);
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
      <div className="flex flex-col gap-4">
        {localItems.map((mod) => (
          <Link
            key={mod._id}
            href={`/scenario/${mod._id}`}
          >
            <CollectionItem item={mod} className="bg-muted hover:bg-muted/50" />
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
          className="flex gap-4 cursor-grab bg-muted hover:bg-muted/50"
        >
          {/* Drag Handle */}
          <SortableItemHandle className="flex flex-1 items-start pt-2">
            <CollectionItem item={mod} className="flex-1 cursor-grab" />
          </SortableItemHandle>


          {/* Remove Button */}
          <div className="flex flex-none items-start pt-2">
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
