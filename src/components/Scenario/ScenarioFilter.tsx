"use client";
import React from "react";
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

export interface FilterValue {
  rule?: string;
  language?: string;
  sortKey?: ModSortKey;
  sortOrder?: string;
}

export interface ScenarioFilterProps {
  config: ModFilterConfig;
  value: FilterValue;
  onChange: (value: FilterValue) => void;
}

export function ScenarioFilter({
  config,
  value,
  onChange,
}: ScenarioFilterProps) {
  const { t, i18n } = useTranslation();

  const handleReset = () => {
    onChange({
      rule: undefined,
      language: undefined,
      sortKey: ModSortKey.LAST_RATE_AT,
      sortOrder: SortOrder.DESC.toString(),
    });
  };

  return (
    <div className="space-y-4">
      <ButtonGroup orientation="horizontal" className="w-full min-w-0">
        <Select
          key={value.rule || 'empty'}
          value={value.rule}
          onValueChange={(rule) => onChange({ ...value, rule })}
        >
          <SelectTrigger className="flex-1 min-w-0">
            <SelectValue placeholder={t("select_rule")} />
          </SelectTrigger>
          <SelectContent>
            {config?.rules.map((rule) => (
              <SelectItem key={rule._id} value={rule._id}>
                {rule._id}({rule.count})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          type="button"
          variant="outline"
          onClick={() => onChange({ ...value, rule: undefined })}
          className="shrink-0"
        >
          <XCircle />
        </Button>
      </ButtonGroup>

      <ButtonGroup orientation="horizontal" className="w-full min-w-0">
        <Select
          key={value.language || 'empty'}
          value={value.language}
          onValueChange={(language) => onChange({ ...value, language })}
        >
          <SelectTrigger className="flex-1 min-w-0">
            <SelectValue placeholder={t("select_languages")} />
          </SelectTrigger>
          <SelectContent>
            {config?.languages.map((language) => (
              <SelectItem key={language._id} value={language._id}>
                {LanguageCodeMap[i18n.language]![language._id as LanguageCodes]}
                ({language.count})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          type="button"
          variant="outline"
          onClick={() => onChange({ ...value, language: undefined })}
          className="shrink-0"
        >
          <XCircle />
        </Button>
      </ButtonGroup>

      <ButtonGroup orientation="horizontal" className="w-full min-w-0">
        <Select
          value={value.sortKey}
          onValueChange={(sortKey) => onChange({ ...value, sortKey: sortKey as ModSortKey })}
        >
          <SelectTrigger className="capitalize flex-1 min-w-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SortKeys.map((key) => (
              <SelectItem key={key} value={key} className="capitalize">
                {ModSortKeyMap[i18n.language]![key]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          className="shrink-0"
          variant="outline"
          type="button"
          onClick={() => {
            onChange({
              ...value,
              sortOrder:
                value.sortOrder?.toString() === SortOrder.DESC.toString()
                  ? SortOrder.ASC.toString()
                  : SortOrder.DESC.toString(),
            });
          }}
        >
          {value.sortOrder?.toString() === SortOrder.DESC.toString() ? (
            <ArrowDownNarrowWide size={16} />
          ) : (
            <ArrowUpNarrowWide size={16} />
          )}
        </Button>
      </ButtonGroup>

      <Button
        className="w-full capitalize"
        type="button"
        variant="outline"
        onClick={handleReset}
      >
        {t("reset_filter", { ns: "common" })}
      </Button>
    </div>
  );
}
