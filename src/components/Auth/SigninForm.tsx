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

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5).max(1024),
});

export type FormData = z.infer<typeof formSchema>;

interface SigninFormProps
  extends Omit<PropsWithChildren<UseFormProps<FormData>>, "resolver"> {
  onSubmit: (data: FormData) => void;
}

export function SigninForm({ onSubmit, children, ...props }: SigninFormProps) {
  const { t } = useTranslation();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    ...props,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="capitalize">{t('email')}</FormLabel>
              <FormControl>
                <Input
                  color={fieldState.invalid ? "destructive" : "default"}
                  placeholder="exmple@dicecho.com"
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
              <FormLabel className="capitalize">{t('password')}</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  color={fieldState.invalid ? "destructive" : "default"}
                  placeholder="*******"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {children}
      </form>
    </Form>
  );
}
