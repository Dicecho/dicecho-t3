"use client";

import { useState, type PropsWithChildren } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useIsMobile } from "@/hooks/use-is-mobile";
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useDicecho } from "@/hooks/useDicecho";
import type { CollectionDto } from "@/types/collection";
import { useTranslation } from "@/lib/i18n/react";
import CoverUpload from "@/components/ui/cover-upload";

const collectionSchema = z.object({
  name: z
    .string(),
  description: z
    .string()
    .optional()
    .or(z.literal("")),
  coverUrl: z.string().optional().or(z.literal("")),
  accessLevel: z.enum(["public", "private"]),
});

type CollectionFormValues = z.infer<typeof collectionSchema>;

interface CollectionEditDialogProps {
  collection?: CollectionDto;
  onSuccess?: (collection: CollectionDto) => void;
}

export function CollectionEditDialog({
  collection,
  onSuccess,
  children,
}: PropsWithChildren<CollectionEditDialogProps>) {
  const [open, setOpen] = useState(false);
  const { api } = useDicecho();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const form = useForm<CollectionFormValues>({
    resolver: zodResolver(collectionSchema),
    defaultValues: collection
      ? {
          name: collection.name ?? "",
          description: collection.description ?? "",
          coverUrl: collection.coverUrl ?? "",
          accessLevel: collection.accessLevel ?? "public",
        }
      : {
          name: "",
          description: "",
          coverUrl: "",
          accessLevel: "public",
        },
  });

  const mutation = useMutation({
    mutationFn: async (values: CollectionFormValues) => {
      if (collection) {
        return api.collection.update(collection._id, values);
      }
      return api.collection.create(values);
    },
    onSuccess: (data) => {
      toast({
        title: t(collection ? "collection_updated" : "collection_created"),
      });
      setOpen(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["collection"] });
      onSuccess?.(data);
    },
    onError: (error: Error) => {
      toast({
        title: t("error"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (values: CollectionFormValues) => {
    console.log('submit', values);
    // mutation.mutate(values);
  };

  const formContent = (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("collection_name")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={t("collection_name_placeholder")}
                    maxLength={50}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("collection_description")}</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder={t("collection_description_placeholder")}
                    maxLength={500}
                    rows={4}
                  />
                </FormControl>
                <FormDescription>
                  {t("collection_description_hint")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="coverUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("collection_cover")}</FormLabel>
                <FormControl>
                  <CoverUpload
                    className="h-40 w-40"
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormDescription>{t("collection_cover_hint")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="accessLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("collection_access_level")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("collection_access_level_placeholder")}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="public">
                      {t("collection_access_public")}
                    </SelectItem>
                    <SelectItem value="private">
                      {t("collection_access_private")}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  {t("collection_access_level_hint")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {!isMobile && (
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                {t("cancel")}
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? t("saving") : t("save")}
              </Button>
            </DialogFooter>
          )}

          {isMobile && (
            <DrawerFooter>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? t("saving") : t("save")}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                {t("cancel")}
              </Button>
            </DrawerFooter>
          )}
        </form>
      </Form>
    </>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{children}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>
              {t(collection ? "edit_collection" : "create_collection")}
            </DrawerTitle>
            <DrawerDescription>
              {t(
                collection ? "edit_collection_hint" : "create_collection_hint",
              )}
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4">{formContent}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {t(collection ? "edit_collection" : "create_collection")}
          </DialogTitle>
          <DialogDescription>
            {t(collection ? "edit_collection_hint" : "create_collection_hint")}
          </DialogDescription>
        </DialogHeader>
        {formContent}
      </DialogContent>
    </Dialog>
  );
}
