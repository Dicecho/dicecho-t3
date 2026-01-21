"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { RichTextEditor } from "@/components/Editor";
import { ScenarioWidget } from "@/components/Scenario/widget";
import { ScenarioSearchDialog } from "@/components/Scenario/scenario-search-dialog";
import { useTranslation } from "@/lib/i18n/react";
import type { ITopicDto } from "@/types/topic";

export interface SimpleModDto {
  _id: string;
  title: string;
  description?: string;
  coverUrl?: string;
  rateAvg?: number;
  rateCount?: number;
}

const topicSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  content: z.string().min(1, "Content is required"),
  isSpoiler: z.boolean().default(false),
});

export type TopicFormValues = z.infer<typeof topicSchema>;

export interface TopicFormSubmitData extends TopicFormValues {
  relatedModIds: string[];
}

interface TopicFormProps {
  topic?: ITopicDto;
  defaultRelatedMod?: SimpleModDto;
  onSubmit: (data: TopicFormSubmitData) => Promise<void> | void;
  submitText?: string;
  isPending?: boolean;
}

export function TopicForm({
  topic,
  defaultRelatedMod,
  onSubmit,
  submitText,
  isPending = false,
}: TopicFormProps) {
  const { t } = useTranslation();

  const [relatedMods, setRelatedMods] = useState<SimpleModDto[]>(() => {
    if (topic?.relatedMods) return topic.relatedMods;
    if (defaultRelatedMod) return [defaultRelatedMod];
    return [];
  });

  const form = useForm<TopicFormValues>({
    resolver: zodResolver(topicSchema),
    defaultValues: {
      title: topic?.title ?? "",
      content: topic?.content ?? "",
      isSpoiler: topic?.isSpoiler ?? false,
    },
  });

  const handleSubmit = async (values: TopicFormValues) => {
    await onSubmit({
      ...values,
      relatedModIds: relatedMods.map((mod) => mod._id),
    });
  };

  const addRelatedMod = (mod: SimpleModDto) => {
    if (relatedMods.some((m) => m._id === mod._id)) return;
    setRelatedMods((prev) => [...prev, mod]);
  };

  const removeRelatedMod = (modId: string) => {
    setRelatedMods((prev) => prev.filter((m) => m._id !== modId));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("topic_title")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={t("topic_title_placeholder")}
                  maxLength={100}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("topic_content")}</FormLabel>
              <FormControl>
                <RichTextEditor
                  markdown={field.value}
                  onMarkdownChange={field.onChange}
                  placeholder={t("topic_content_placeholder")}
                  className="min-h-[200px] px-3 py-2 bg-input/30 shadow-xs rounded-md"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>{t("topic_related_mods")}</FormLabel>
          {relatedMods.map((mod) => (
            <ScenarioWidget
              key={mod._id}
              scenario={mod}
              variant="compact"
              clickable={false}
              action={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => removeRelatedMod(mod._id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              }
            />
          ))}
          <ScenarioSearchDialog
            onSelect={addRelatedMod}
            excludeIds={relatedMods.map((m) => m._id)}
          >
            <Button type="button" variant="outline" className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              {t("topic_add_related_mod")}
            </Button>
          </ScenarioSearchDialog>
        </div>

        <FormField
          control={form.control}
          name="isSpoiler"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3">
              <FormLabel className="!mt-0 cursor-pointer">
                {t("topic_spoiler")}
              </FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? t("saving") : (submitText ?? t("submit_now"))}
          </Button>
        </div>
      </form>
    </Form>
  );
}
