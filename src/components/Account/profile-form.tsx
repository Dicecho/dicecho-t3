"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RichTextEditor } from "@/components/Editor/RichTextEditor";
import BackgroundUpload from "@/components/ui/background-upload";
import { useDicecho } from "@/hooks/useDicecho";
import { useTranslation } from "@/lib/i18n/react";
import type { IUserDto } from "@dicecho/types";
import { toast } from "sonner";

type ProfileFormProps = {
  user: IUserDto;
  showCard?: boolean;
};

const profileSchema = z.object({
  nickName: z.string().min(2).max(32),
  note: z.string().max(140).optional().or(z.literal("")),
  notice: z.string().max(2000).optional().or(z.literal("")),
  backgroundUrl: z.string().url().optional().or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileForm({ user, showCard = true }: ProfileFormProps) {
  const { api } = useDicecho();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nickName: user.nickName ?? "",
      note: user.note ?? "",
      notice: user.notice ?? "",
      backgroundUrl: user.backgroundUrl ?? "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: ProfileFormValues) => {
      return api.user.updateProfile({
        nickName: values.nickName,
        note: values.note || undefined,
        notice: values.notice || undefined,
        backgroundUrl: values.backgroundUrl || undefined,
      });
    },
    onSuccess: (updatedUser) => {
      toast.success(t("settings_profile_saved"));
      form.reset({
        nickName: updatedUser.nickName ?? "",
        note: updatedUser.note ?? "",
        notice: updatedUser.notice ?? "",
        backgroundUrl: updatedUser.backgroundUrl ?? "",
      });
      queryClient.invalidateQueries({ queryKey: ["user", "profile", user._id] });
    },
  });

  const formContent = (
    <Form {...form}>
      <form
        className="space-y-4"
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
      >
        <FormField
          control={form.control}
          name="nickName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("nickname")}</FormLabel>
              <FormControl>
                <Input {...field} maxLength={32} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("profile_note_label")}</FormLabel>
              <FormControl>
                <Input {...field} maxLength={140} />
              </FormControl>
              <FormDescription>{t("profile_note_hint")}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("profile_notice_label")}</FormLabel>
              <FormControl>
                <div className="min-h-[200px] border rounded-md overflow-hidden">
                  <RichTextEditor
                    markdown={field.value}
                    onMarkdownChange={field.onChange}
                    placeholder={t("profile_notice_placeholder")}
                    className="min-h-[180px] p-2 bg-input/20"
                  />
                </div>
              </FormControl>
              <FormDescription>{t("profile_notice_hint")}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="backgroundUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("profile_background_label")}</FormLabel>
              <FormControl>
                <BackgroundUpload
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? t("saving") : t("save")}
        </Button>
      </form>
    </Form>
  );

  if (!showCard) {
    return formContent;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("settings_profile_title")}</CardTitle>
        <CardDescription>{t("settings_profile_hint")}</CardDescription>
      </CardHeader>
      <CardContent>{formContent}</CardContent>
    </Card>
  );
}
