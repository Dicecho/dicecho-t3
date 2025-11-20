"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDicecho } from "@/hooks/useDicecho";
import { useTranslation } from "@/lib/i18n/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Empty } from "@/components/Empty";
import { CollectionEditDialog } from "./CollectionEditDialog";
import { CollectionDeleteDialog } from "./CollectionDeleteDialog";
import { CollectionItemsList } from "./CollectionItemsList";
import type { CollectionDto } from "@/types/collection";
import { Heart, MessageSquare, User, Edit, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import Image from "next/image";

interface CollectionDetailProps {
  collection: CollectionDto;
}

export const CollectionDetail = ({ collection }: CollectionDetailProps) => {
  const router = useRouter();
  const { api } = useDicecho();
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
      toast({
        title: t(
          collection.isFavorited
            ? "collection_unfavorited"
            : "collection_favorited",
        ),
      });
    },
    onError: (error: Error) => {
      toast({
        title: t("error"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="space-y-4">
      {/* Collection Header */}
      <Card>
        <CardContent className="flex w-full gap-4">
          {collection.coverUrl && (
            <Image
              src={collection.coverUrl}
              alt={collection.name}
              className="object-cover aspect-square w-40 h-40 rounded-md"
              width={160}
              height={160}
              priority
            />
          )}

          <div className="space-y-4 flex-1">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <CardTitle className="text-2xl">{collection.name}</CardTitle>
                  <Badge
                    variant={
                      collection.accessLevel === "public"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {collection.accessLevel === "public"
                      ? t("collection_access_public")
                      : t("collection_access_private")}
                  </Badge>
                </div>
                <CardDescription>
                  {t("collection_created_at", {
                    date: new Intl.DateTimeFormat(i18n.language, {
                      dateStyle: "medium",
                    }).format(new Date(collection.createdAt)),
                  })}
                </CardDescription>
              </div>

              <div className="flex items-center gap-2">
                {collection.canEdit && (
                  <>
                    <CollectionEditDialog collection={collection}>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </CollectionEditDialog>
                    <CollectionDeleteDialog
                      collection={collection}
                      onSuccess={() => router.push(`/collection`)}
                    >
                      <Button variant="ghost" size="icon">
                        <Trash className="text-destructive h-4 w-4" />
                      </Button>
                    </CollectionDeleteDialog>
                  </>
                )}
              </div>
            </div>

            {/* Creator */}
            <Link
              href={`/account/${collection.user._id}`}
              className="flex w-fit items-center gap-2 transition-opacity hover:opacity-80"
            >
              <Avatar className="h-6 w-6">
                <AvatarImage src={collection.user.avatarUrl} />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <span className="text-muted-foreground text-sm">
                {collection.user.nickName}
              </span>
            </Link>
            {/* Description */}
            {collection.description ? (
              <p className="text-foreground text-sm leading-relaxed">
                {collection.description}
              </p>
            ) : (
              <p className="text-muted-foreground text-sm">
                {t("collection_no_description")}
              </p>
            )}

            {/* Stats and Actions */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="text-muted-foreground flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  {t("collection_favorite_count", {
                    count: collection.favoriteCount,
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  {t("collection_comment_count", {
                    count: collection.commentCount,
                  })}
                </span>
              </div>

              {!collection.canEdit && (
                <Button
                  variant={collection.isFavorited ? "outline" : "default"}
                  size="sm"
                  onClick={() =>
                    favoriteMutation.mutate(collection.isFavorited)
                  }
                  disabled={favoriteMutation.isPending}
                >
                  <Heart
                    className={`mr-2 h-4 w-4 ${collection.isFavorited ? "fill-current" : ""}`}
                  />
                  {collection.isFavorited
                    ? t("collection_unfavorite")
                    : t("collection_favorite")}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="px-6">
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="items">
                  {t("collection_items_tab")}
                  {(items?.length ?? 0) > 0 && (
                    <Badge variant="accent" className="ml-2">
                      {items?.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="comments">
                  {t("comments")}
                  {collection.commentCount > 0 && (
                    <Badge variant="accent" className="ml-2">
                      {collection.commentCount}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              {collection.canEdit && activeTab === "items" && (
                <Button
                  variant={isEditMode ? "default" : "outline"}
                  size="sm"
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
                  canEdit={collection.canEdit}
                  isEditMode={isEditMode}
                />
              ) : (
                <Empty>
                  <div className="text-muted-foreground">
                    {collection.canEdit
                      ? t("collection_items_empty_self")
                      : t("collection_items_empty")}
                  </div>
                </Empty>
              )}
            </TabsContent>

            <TabsContent value="comments" className="mt-4">
              <div className="text-muted-foreground py-12 text-center">
                TODO: {t("comments_coming_soon")}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
