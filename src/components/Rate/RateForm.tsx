"use client";

import { useState } from "react";
import { KEYS } from "platejs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
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
import { Button } from "@/components/ui/button";
import { Rate } from "@/components/ui/rate";
import { RichTextEditor } from "@/components/Editor";
import type { IRateDto } from "@dicecho/types";
import {
  RateView,
  RateType,
  AccessLevel,
  RemarkContentType,
} from "@dicecho/types";
import { useTranslation } from "@/lib/i18n/react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Lock, User, Crown, Eye } from "lucide-react";

const rateSchema = z.object({
  rate: z.number().min(0).max(10),
  remark: z.string().optional().or(z.literal("")),
  type: z.nativeEnum(RateType),
  view: z.nativeEnum(RateView).optional(),
  isAnonymous: z.boolean().optional(),
  accessLevel: z.nativeEnum(AccessLevel).optional(),
});

export type RateFormValues = z.infer<typeof rateSchema>;

interface RateFormProps {
  rate?: IRateDto;
  onSubmit: (values: RateFormValues) => void | Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
  showActions?: boolean;
}

export function RateForm({
  rate,
  onSubmit,
  isSubmitting = false,
}: RateFormProps) {
  const { t } = useTranslation();

  const form = useForm<RateFormValues>({
    resolver: zodResolver(rateSchema),
    defaultValues: rate
      ? {
          rate: rate.rate ?? 0,
          remark: rate.remark ?? "",
          type: rate.type ?? RateType.Rate,
          view: rate.view ?? RateView.PL,
          isAnonymous: rate.isAnonymous ?? false,
          accessLevel: rate.accessLevel ?? AccessLevel.Public,
        }
      : {
          rate: 0,
          remark: "",
          type: RateType.Rate,
          view: RateView.PL,
          isAnonymous: false,
          accessLevel: AccessLevel.Public,
        },
  });

  const rateType = form.watch("type");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 overflow-hidden"
      >
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <Tabs
                value={field.value.toString()}
                onValueChange={(value) =>
                  field.onChange(parseInt(value))
                }
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value={RateType.Rate.toString()}>
                    {t("Rate.type_rate")}
                  </TabsTrigger>
                  <TabsTrigger value={RateType.Mark.toString()}>
                    {t("Rate.type_mark")}
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </FormItem>
          )}
        />

        {rateType === RateType.Rate && (
          <FormField
            control={form.control}
            name="rate"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center gap-4">
                    <Rate
                      value={field.value / 2}
                      onChange={(value) => field.onChange(value * 2)}
                      allowHalf
                      allowClear
                      size="lg"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="remark"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="w-full max-w-full overflow-x-hidden overflow-y-auto rounded-md bg-card p-2">
                  <RichTextEditor
                    className="max-h-80 min-h-32"
                    options={
                      rate && rate.remarkType === RemarkContentType.Richtext
                        ? {
                            value: rate.richTextState
                              ? rate.richTextState.map((node) => ({
                                  ...node,
                                  type: node.type ?? KEYS.p,
                                }))
                              : [],
                          }
                        : {}
                    }
                    markdown={field.value}
                    onMarkdownChange={field.onChange}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <FormField
            control={form.control}
            name="accessLevel"
            render={({ field }) => (
              <FormItem>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      {field.value === AccessLevel.Public && <Globe className="h-4 w-4" />}
                      {field.value === AccessLevel.Private && <Lock className="h-4 w-4" />}
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={AccessLevel.Public}>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        <span>{t("access_public")}</span>
                      </div>
                    </SelectItem>
                    <SelectItem value={AccessLevel.Private}>
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        <span>{t("access_private")}</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {rateType === RateType.Rate && (
            <FormField
              control={form.control}
              name="view"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={(value) =>
                      field.onChange(parseInt(value) as RateView)
                    }
                    value={field.value?.toString() ?? RateView.PL.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        {field.value === RateView.PL && <User className="h-4 w-4" />}
                        {field.value === RateView.KP && <Crown className="h-4 w-4" />}
                        {field.value === RateView.OB && <Eye className="h-4 w-4" />}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={RateView.PL.toString()}>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>{t("Rate.view_pl")}</span>
                        </div>
                      </SelectItem>
                      <SelectItem value={RateView.KP.toString()}>
                        <div className="flex items-center gap-2">
                          <Crown className="h-4 w-4" />
                          <span>{t("Rate.view_kp")}</span>
                        </div>
                      </SelectItem>
                      <SelectItem value={RateView.OB.toString()}>
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          <span>{t("Rate.view_ob")}</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <Button type="submit" disabled={isSubmitting} className="ml-auto">
            {isSubmitting ? t("saving") : t("save")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
