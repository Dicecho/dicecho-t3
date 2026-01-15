"use client";

import { useRouter, useParams } from "next/navigation";
import { MoreVerticalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ActionSheet,
  ActionSheetTrigger,
  ActionSheetContent,
  ActionSheetGroup,
  ActionSheetItem,
  ActionSheetClose,
} from "@/components/ui/action-sheet";
import { useTranslation } from "@/lib/i18n/react";
import { ShareButton } from "@/components/ui/share-button";
import { CollectionEditDialog } from "./CollectionEditDialog";
import { CollectionDeleteDialog } from "./CollectionDeleteDialog";
import type { CollectionDto } from "@/types/collection";

interface CollectionActionsProps {
  collection: CollectionDto;
}

export function CollectionActions({ collection }: CollectionActionsProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const lng = params.lng as string;

  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/${lng}/collection/${collection._id}`;

  return (
    <ActionSheet>
      <ActionSheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVerticalIcon size={20} />
        </Button>
      </ActionSheetTrigger>
      <ActionSheetContent>
        <ActionSheetGroup>
          <ShareButton url={shareUrl} title={collection.name} asChild>
            <ActionSheetItem>{t("share")}</ActionSheetItem>
          </ShareButton>
          {collection.canEdit && (
            <CollectionEditDialog collection={collection}>
              <ActionSheetItem>{t("edit")}</ActionSheetItem>
            </CollectionEditDialog>
          )}
          {collection.canEdit && !collection.isDefault && (
            <CollectionDeleteDialog
              collection={collection}
              onSuccess={() => router.push(`/${lng}/collection`)}
            >
              <ActionSheetItem variant="destructive">
                {t("delete")}
              </ActionSheetItem>
            </CollectionDeleteDialog>
          )}
        </ActionSheetGroup>
        <ActionSheetGroup variant="cancel">
          <ActionSheetClose asChild>
            <ActionSheetItem>{t("cancel")}</ActionSheetItem>
          </ActionSheetClose>
        </ActionSheetGroup>
      </ActionSheetContent>
    </ActionSheet>
  );
}
