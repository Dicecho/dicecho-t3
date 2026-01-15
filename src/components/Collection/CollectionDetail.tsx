"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDicecho } from "@/hooks/useDicecho";
import { useTranslation } from "@/lib/i18n/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Empty } from "@/components/Empty";
import { CollectionEditDialog } from "./CollectionEditDialog";
import { CollectionDeleteDialog } from "./CollectionDeleteDialog";
import { CollectionItemsList } from "./CollectionItemsList";
import { CommentPanel } from "@/components/Comment/comment-panel";
import { ShareButton } from "@/components/ui/share-button";
import { ReadMoreText } from "@/components/ui/read-more-text";
import type { CollectionDto } from "@/types/collection";
import { Pencil, Trash2, FolderPlus, Folder } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import { UserAvatar } from "@/components/User/Avatar";
import { cn } from "@/lib/utils";

interface CollectionDetailProps {
  collection: CollectionDto;
}

export const CollectionDetail = ({ collection }: CollectionDetailProps) => {
  const router = useRouter();
  const params = useParams();
  const lng = params.lng as string;
  const { api, session } = useDicecho();
  const canEdit = session?.user?._id === collection.user._id;
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"items" | "comments">("items");
  const [isEditMode, setIsEditMode] = useState(false);

  const { data: items, isLoading: isItemsLoading } = useQuery({
    queryKey: ["collection", "items", collection._id],
    queryFn: () => api.collection.items(collection._id),
  });

  const favoriteMutation = useMutation({
    mutationFn: async (isFavorited: boolean) => {
      if (isFavorited) {
        return api.collection.cancelFavorite(collection._id);
      }
      return api.collection.favorite(collection._id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["collection", "detail", collection._id],
      });
      toast.success(
        t(
          collection.isFavorited
            ? "collection_unfavorited"
            : "collection_favorited",
        ),
      );
    },
    onError: (error: Error) => {
      toast.error(t("error"), {
        description: error.message,
      });
    },
  });

  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/${lng}/collection/${collection._id}`;
  const itemCount = items?.length ?? 0;
  const accessLevelText =
    collection.accessLevel === "public"
      ? t("collection_access_public")
      : t("collection_access_private");

  // Description component with fold/unfold
  const DescriptionBlock = ({ className }: { className?: string }) => {
    if (!collection.description) {
      if (canEdit) {
        return (
          <CollectionEditDialog collection={collection}>
            <span
              className={cn(
                "text-muted-foreground cursor-pointer text-sm hover:underline",
                className,
              )}
            >
              {t("collection_add_description")}
            </span>
          </CollectionEditDialog>
        );
      }
      return (
        <p className={cn("text-muted-foreground text-sm", className)}>
          {t("collection_no_description")}
        </p>
      );
    }

    return (
      <ReadMoreText className={cn("text-muted-foreground text-sm", className)}>
        {t("collection_description_prefix")}
        {collection.description}
      </ReadMoreText>
    );
  };

  return (
    <div className="space-y-4">
      {/* Mobile: Blur Background */}
      {collection.coverUrl && (
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96 overflow-hidden md:hidden">
          <div
            className="absolute -inset-5 bg-cover bg-center brightness-[0.7] blur-[20px]"
            style={{ backgroundImage: `url(${collection.coverUrl})` }}
          />
          {/* Gradient overlay for smooth transition */}
          <div className="from-background/0 via-background/50 to-background absolute inset-x-0 bottom-0 h-32 bg-linear-to-b" />
        </div>
      )}

      {/* Collection Header */}
      <Card className="relative max-md:rounded-none max-md:border-0 max-md:bg-transparent max-md:shadow-none max-md:pt-18">
        <CardContent className="flex w-full flex-col gap-4 md:flex-row">
          {/* Cover Image */}
          <div className="flex gap-4 md:contents">
            {collection.coverUrl ? (
              <Image
                src={collection.coverUrl}
                alt={collection.name}
                className="aspect-square h-[120px] w-[120px] shrink-0 rounded-md object-cover md:h-40 md:w-40"
                width={160}
                height={160}
                priority
              />
            ) : (
              <div className="bg-muted flex h-[120px] w-[120px] shrink-0 items-center justify-center rounded-md md:h-40 md:w-40">
                <Folder className="text-muted-foreground h-12 w-12" />
              </div>
            )}

            {/* Mobile: Title and basic info next to cover */}
            <div className="flex gap-2 min-w-0 flex-1 flex-col justify-center md:hidden">
              <CardTitle className="text-lg">{collection.name}</CardTitle>

              {/* User info */}
              <Link
                href={`/account/${collection.user._id}`}
                className="flex w-fit items-center gap-1.5 transition-opacity hover:opacity-80"
              >
                <UserAvatar user={{
                  nickName: collection.user.nickName,
                  avatarUrl: collection.user.avatarUrl,
                }} className="h-6 w-6" />
                <span className="text-muted-foreground">
                  {collection.user.nickName}
                </span>
              </Link>

              {/* Favorite button */}
              <div className="mt-2">
                <Button
                  variant={collection.isFavorited ? "outline" : "default"}
                  size="sm"
                  className="rounded-full"
                  disabled={canEdit || favoriteMutation.isPending}
                  onClick={() =>
                    favoriteMutation.mutate(collection.isFavorited)
                  }
                >
                  {collection.isFavorited ? (
                    <Folder className="mr-1 h-4 w-4" />
                  ) : (
                    <FolderPlus className="mr-1 h-4 w-4" />
                  )}
                  {collection.isFavorited
                    ? t("collection_unfavorite")
                    : t("collection_favorite")}
                  {collection.favoriteCount > 0 &&
                    ` (${collection.favoriteCount})`}
                </Button>
              </div>
            </div>
          </div>

          {/* Desktop: Main info area */}
          <div className="hidden flex-1 space-y-2 md:block">
            {/* Title with edit button */}
            <div className="flex items-center gap-2">
              <CardTitle className="text-2xl">{collection.name}</CardTitle>
              {canEdit && (
                <CollectionEditDialog collection={collection}>
                  <button className="text-muted-foreground hover:text-primary transition-colors">
                    <Pencil className="h-4 w-4" />
                  </button>
                </CollectionEditDialog>
              )}
            </div>

            {/* User info + created date */}
            <div className="text-muted-foreground flex items-center gap-2">
              <Link
                href={`/account/${collection.user._id}`}
                className="flex items-center gap-1.5 transition-opacity hover:opacity-80"
              >
                <UserAvatar user={{
                  nickName: collection.user.nickName,
                  avatarUrl: collection.user.avatarUrl,
                }} className="h-6 w-6" />
                <span>{collection.user.nickName}</span>
              </Link>
              <span>·</span>
              <span>
                {new Intl.DateTimeFormat(i18n.language, {
                  dateStyle: "medium",
                }).format(new Date(collection.createdAt))}{" "}
                {t("collection_created_suffix")}
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 pt-1">
              <Button
                variant={collection.isFavorited ? "outline" : "default"}
                size="sm"
                className="rounded-full"
                disabled={canEdit || favoriteMutation.isPending}
                onClick={() => favoriteMutation.mutate(collection.isFavorited)}
              >
                {collection.isFavorited ? (
                  <Folder className="mr-1.5 h-4 w-4" />
                ) : (
                  <FolderPlus className="mr-1.5 h-4 w-4" />
                )}
                {collection.isFavorited
                  ? t("collection_unfavorite")
                  : t("collection_favorite")}
                {collection.favoriteCount > 0 &&
                  ` (${collection.favoriteCount})`}
              </Button>

              <ShareButton url={shareUrl} title={collection.name} variant="outline" size="sm" className="rounded-full">
                {t("share")}
              </ShareButton>

              {canEdit && !collection.isDefault && (
                <CollectionDeleteDialog
                  collection={collection}
                  onSuccess={() => router.push(`/collection`)}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive rounded-full"
                  >
                    <Trash2 className="mr-1.5 h-4 w-4" />
                    {t("delete")}
                  </Button>
                </CollectionDeleteDialog>
              )}
            </div>

            {/* Stats: item count + access level */}
            <div className="text-muted-foreground text-sm">
              {t("collection_items_count", { count: itemCount })} ·{" "}
              {accessLevelText}
            </div>

            {/* Description */}
            <DescriptionBlock />
          </div>

          {/* Mobile: Stats and description below cover */}
          <div className="space-y-2 md:hidden">
            {/* Stats: item count + access level */}
            <div className="text-muted-foreground text-sm">
              {t("collection_items_count", { count: itemCount })} ·{" "}
              {accessLevelText}
            </div>

            {/* Description */}
            <DescriptionBlock />
          </div>
        </CardContent>
      </Card>

      {/* Tabs Card */}
      <Card className="max-md:rounded-none">
        <CardContent className="px-4">
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as "items" | "comments")}
          >
            <div className="flex items-center justify-between gap-4">
              <TabsList className="max-md:flex-1">
                <TabsTrigger value="items" className="flex-1">
                  {t("collection_items_tab")}({itemCount})
                </TabsTrigger>
                <TabsTrigger value="comments" className="flex-1">
                  {t("comments")}({collection.commentCount})
                </TabsTrigger>
              </TabsList>

              {canEdit && activeTab === "items" && (
                <Button
                  variant={isEditMode ? "default" : "outline"}
                  onClick={() => setIsEditMode(!isEditMode)}
                >
                  {isEditMode ? t("done") : t("edit")}
                </Button>
              )}
            </div>

            <TabsContent value="items" className="mt-4">
              {isItemsLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="flex gap-4">
                      <Skeleton className="h-32 w-24 flex-none rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-2/3" />
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : items && items.length > 0 ? (
                <CollectionItemsList
                  collectionId={collection._id}
                  items={items}
                  canEdit={canEdit}
                  isEditMode={isEditMode}
                />
              ) : (
                <Empty>
                  <div className="text-muted-foreground">
                    {canEdit
                      ? t("collection_items_empty_self")
                      : t("collection_items_empty")}
                  </div>
                </Empty>
              )}
            </TabsContent>

            <TabsContent value="comments" className="mt-4">
              <CommentPanel
                targetName="Collection"
                targetId={collection._id}
                initialCount={collection.commentCount}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
