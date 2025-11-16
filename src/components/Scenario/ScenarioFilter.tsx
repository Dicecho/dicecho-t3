"use client";
import React, { useEffect } from "react";
import { ModSortKey, SortOrder, type ModFilterConfig } from "@dicecho/types";
import { type LanguageCodes, LanguageCodeMap } from "@/utils/language";
import { ArrowUpNarrowWide, ArrowDownNarrowWide, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useTranslation } from "@/lib/i18n/react";

const SortKeys = [
  ModSortKey.RELEASE_DATE,
  ModSortKey.RATE_COUNT,
  ModSortKey.RATE_AVG,
  ModSortKey.LAST_RATE_AT,
  ModSortKey.LAST_EDIT_AT,
  ModSortKey.CREATED_AT,
  ModSortKey.UPDATED_AT,
] as const;

export const ModSortKeyMap: Record<string, Record<ModSortKey, string>> = {
  zh: {
    [ModSortKey.RATE_AVG]: "评分",
    [ModSortKey.RATE_COUNT]: "评价人数",
    [ModSortKey.RELEASE_DATE]: "发布时间",
    [ModSortKey.LAST_RATE_AT]: "最后评价时间",
    [ModSortKey.LAST_EDIT_AT]: "最后编辑时间",
    [ModSortKey.CREATED_AT]: "创建时间",
    [ModSortKey.UPDATED_AT]: "更新时间",
  },
  en: {
    [ModSortKey.RATE_AVG]: "average rating",
    [ModSortKey.RATE_COUNT]: "rating count",
    [ModSortKey.RELEASE_DATE]: "release date",
    [ModSortKey.LAST_RATE_AT]: "last rate at",
    [ModSortKey.LAST_EDIT_AT]: "last edit at",
    [ModSortKey.CREATED_AT]: "created at",
    [ModSortKey.UPDATED_AT]: "updated at",
  },
  ja: {
    [ModSortKey.RATE_AVG]: "平均評価",
    [ModSortKey.RATE_COUNT]: "評価数",
    [ModSortKey.RELEASE_DATE]: "発売日",
    [ModSortKey.LAST_RATE_AT]: "最終評価時間",
    [ModSortKey.LAST_EDIT_AT]: "最終編集時間",
    [ModSortKey.CREATED_AT]: "作成時間",
    [ModSortKey.UPDATED_AT]: "更新時間",
  },
};

const formSchema = z.object({
  rule: z.string().optional(),
  language: z.string().optional(),
  sortKey: z.enum(SortKeys).optional(),
  sortOrder: z.string().optional(),
});

export type FormData = z.infer<typeof formSchema>;

export interface ScenarioFilterProps {
  config: ModFilterConfig;
  initialFilter?: Partial<FormData>;
  onChange?: (filter: FormData) => void;
}

export function ScenarioFilter({
  config,
  initialFilter = {},
  onChange = () => {},
}: ScenarioFilterProps) {
  const { t, i18n } = useTranslation();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sortKey: ModSortKey.LAST_RATE_AT,
      sortOrder: SortOrder.DESC.toString(),
      ...initialFilter,
    },
  });

  useEffect(() => {
    const { unsubscribe } = form.watch((values) => {
      onChange(values);
    });

    return () => unsubscribe();
  }, [form, onChange]);

  return (
    <Form {...form}>
      <form className="space-y-4">
        <FormField
          control={form.control}
          name="rule"
          render={({ field }) => (
            <FormItem>
              <ButtonGroup orientation="horizontal" className="w-full">
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("select_rule")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {config?.rules.map((rule) => (
                      <SelectItem key={rule._id} value={rule._id}>
                        {rule._id}({rule.count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={() => field.onChange("")}>
                  <XCircle />
                </Button>
              </ButtonGroup>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <ButtonGroup orientation="horizontal" className="w-full">
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("select_languages")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {config?.languages.map((language) => (
                      <SelectItem key={language._id} value={language._id}>
                        {
                          LanguageCodeMap[i18n.language]![
                            language._id as LanguageCodes
                          ]
                        }
                        ({language.count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={() => field.onChange("")}>
                  <XCircle />
                </Button>
              </ButtonGroup>
              <FormMessage />
            </FormItem>
          )}
        />

        <ButtonGroup orientation="horizontal" className="w-full">
          <FormField
            control={form.control}
            name="sortKey"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="capitalize w-full">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {SortKeys.map((key) => (
                    <SelectItem key={key} value={key} className="capitalize">
                      {ModSortKeyMap[i18n.language]![key]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

          <FormField
            control={form.control}
            name="sortOrder"
            render={({ field }) => (
              <Button
                type="button"
                onClick={() => {
                  field.onChange(
                    field.value?.toString() === SortOrder.DESC.toString()
                      ? SortOrder.ASC
                      : SortOrder.DESC,
                  );
                }}
              >
                {field.value?.toString() === SortOrder.DESC.toString() ? (
                  <ArrowDownNarrowWide size={16} />
                ) : (
                  <ArrowUpNarrowWide size={16} />
                )}
              </Button>
            )}
          />
        </ButtonGroup>
        <Button
          className="w-full capitalize"
          color="destructive"
          type="button"
          variant="outline"
          onClick={() =>
            form.reset({
              rule: "",
              language: "",
              sortKey: ModSortKey.LAST_RATE_AT,
              sortOrder: SortOrder.DESC.toString(),
            })
          }
        >
          {t("reset_filter", { ns: "common" })}
        </Button>
      </form>
    </Form>
  );
}
