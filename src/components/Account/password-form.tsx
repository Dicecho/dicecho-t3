"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
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
import { useDicecho } from "@/hooks/useDicecho";
import { useTranslation } from "@/lib/i18n/react";
import { toast } from "sonner";

type PasswordFormProps = {
  showCard?: boolean;
};

const passwordSchema = z.object({
  oldPassword: z.string().min(5),
  newPassword: z.string().min(6),
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

export function PasswordForm({ showCard = true }: PasswordFormProps) {
  const { api } = useDicecho();
  const { t } = useTranslation();

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (values: PasswordFormValues) => api.user.changePassword(values),
    onSuccess: () => {
      toast.success(t("settings_password_saved"));
      form.reset();
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
          control={form.control}
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
        <Button type="submit" variant="outline" disabled={mutation.isPending}>
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
        <CardTitle>{t("settings_password_title")}</CardTitle>
        <CardDescription>{t("settings_password_hint")}</CardDescription>
      </CardHeader>
      <CardContent>{formContent}</CardContent>
    </Card>
  );
}
