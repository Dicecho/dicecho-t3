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
});

export type SignupFormData = z.infer<typeof formSchema>;

interface SignupFormProps
  extends Omit<PropsWithChildren<UseFormProps<SignupFormData>>, "resolver"> {
  onSubmit: (data: SignupFormData) => Promise<void> | void;
}

export function SignupForm({ onSubmit, children, ...props }: SignupFormProps) {
  const { t } = useTranslation();
  const { defaultValues, ...rest } = props;

  const form = useForm<SignupFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      ...defaultValues,
    },
    ...rest,
  });

  const handleSubmit = async (data: SignupFormData) => {
    await onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="capitalize">{t("email")}</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  color={fieldState.invalid ? "destructive" : "default"}
                  placeholder="example@dicecho.com"
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
