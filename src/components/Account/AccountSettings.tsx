"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useDicecho } from "@/hooks/useDicecho";
import { useTranslation } from "@/lib/i18n/react";
import type { IUserDto } from "@dicecho/types";
import { toast } from "@/components/ui/use-toast";

type AccountSettingsProps = {
  user: IUserDto;
};

const profileSchema = z.object({
  nickName: z.string().min(2).max(32),
  note: z.string().max(140).optional().or(z.literal("")),
  notice: z.string().max(2000).optional().or(z.literal("")),
  backgroundUrl: z.string().url().optional().or(z.literal("")),
});

const passwordSchema = z.object({
  oldPassword: z.string().min(5),
  newPassword: z.string().min(6),
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export const AccountSettings = ({ user }: AccountSettingsProps) => {
  const { api } = useDicecho();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nickName: user.nickName ?? "",
      note: user.note ?? "",
      notice: user.notice ?? "",
      backgroundUrl: user.backgroundUrl ?? "",
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
  });

  const profileMutation = useMutation({
    mutationFn: async (values: ProfileFormValues) => {
      return api.user.updateProfile({
        nickName: values.nickName,
        note: values.note || undefined,
        notice: values.notice || undefined,
        backgroundUrl: values.backgroundUrl || undefined,
      });
    },
    onSuccess: (updatedUser) => {
      toast({ title: t("settings_profile_saved") });
      profileForm.reset({
        nickName: updatedUser.nickName ?? "",
        note: updatedUser.note ?? "",
        notice: updatedUser.notice ?? "",
        backgroundUrl: updatedUser.backgroundUrl ?? "",
      });
      queryClient.invalidateQueries({ queryKey: ["user", "profile", user._id] });
    },
  });

  const passwordMutation = useMutation({
    mutationFn: (values: PasswordFormValues) => api.user.changePassword(values),
    onSuccess: () => {
      toast({ title: t("settings_password_saved") });
      passwordForm.reset();
    },
  });

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("settings_profile_title")}</CardTitle>
          <CardDescription>{t("settings_profile_hint")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...profileForm}>
            <form
              className="space-y-4"
              onSubmit={profileForm.handleSubmit((values) => profileMutation.mutate(values))}
            >
              <FormField
                control={profileForm.control}
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
                control={profileForm.control}
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
                control={profileForm.control}
                name="notice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("profile_notice_label")}</FormLabel>
                    <FormControl>
                      <Textarea rows={4} {...field} />
                    </FormControl>
                    <FormDescription>{t("profile_notice_hint")}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={profileForm.control}
                name="backgroundUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("profile_background_label")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>{t("profile_background_hint")}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={profileMutation.isPending}>
                {profileMutation.isPending ? t("saving") : t("save")}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("settings_password_title")}</CardTitle>
          <CardDescription>{t("settings_password_hint")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...passwordForm}>
            <form
              className="space-y-4"
              onSubmit={passwordForm.handleSubmit((values) => passwordMutation.mutate(values))}
            >
              <FormField
                control={passwordForm.control}
                name="oldPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("settings_password_old")}</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("settings_password_new")}</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormDescription>{t("settings_password_hint")}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" variant="outline" disabled={passwordMutation.isPending}>
                {passwordMutation.isPending ? t("saving") : t("save")}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

