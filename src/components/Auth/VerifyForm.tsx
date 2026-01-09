"use client";
import React, { type PropsWithChildren } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormProps } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/lib/i18n/react";

const formSchema = z
  .object({
    nickName: z.string().min(2).max(50),
    password: z.string().min(5).max(1024),
    confirmPassword: z.string().min(5).max(1024),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "passwords_not_match",
    path: ["confirmPassword"],
  });

export type VerifyFormData = z.infer<typeof formSchema>;

interface VerifyFormProps
  extends Omit<PropsWithChildren<UseFormProps<VerifyFormData>>, "resolver"> {
  onSubmit: (data: Omit<VerifyFormData, "confirmPassword">) => Promise<void> | void;
}

export function VerifyForm({ onSubmit, children, ...props }: VerifyFormProps) {
  const { t } = useTranslation();
  const { defaultValues, ...rest } = props;

  const form = useForm<VerifyFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nickName: "",
      password: "",
      confirmPassword: "",
      ...defaultValues,
    },
    ...rest,
  });

  const handleSubmit = async (data: VerifyFormData) => {
    await onSubmit({
      nickName: data.nickName,
      password: data.password,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nickName"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="capitalize">{t("username")}</FormLabel>
              <FormControl>
                <Input
                  color={fieldState.invalid ? "destructive" : "default"}
                  placeholder={t("enter_username")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="capitalize">{t("password")}</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  color={fieldState.invalid ? "destructive" : "default"}
                  placeholder={t("enter_password")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="capitalize">{t("confirm_password")}</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  color={fieldState.invalid ? "destructive" : "default"}
                  placeholder={t("enter_password_again")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <p className="text-sm text-muted-foreground">
          {t("agree_to_terms_prefix")}
          <a
            href="/notice/terms"
            target="_blank"
            className="text-primary underline hover:no-underline"
          >
            {t("terms_of_service")}
          </a>
        </p>
        {children}
      </form>
    </Form>
  );
}
