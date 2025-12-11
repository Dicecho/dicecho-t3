"use client";
import React, { useCallback } from "react";
import { TagFilterMode, type ModFilterConfig } from "@dicecho/types";
import { type LanguageCodes, LanguageCodeMap } from "@/utils/language";
import { XCircle } from "lucide-react";
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
import MultipleSelector, {
  type Option,
} from "@/components/ui/multiple-selector";
import { useDicecho } from "@/hooks/useDicecho";
import { Slider } from "@/components/ui/slider";

export interface FilterValue {
  rule?: string;
  language?: string;
  tags?: string[];
  tagsMode?: TagFilterMode;
  players?: number[];
}

export interface ScenarioFilterProps {
  config?: ModFilterConfig;
  value: FilterValue;
  onChange: (value: FilterValue) => void;
}

export function ScenarioFilter({
  config,
  value,
  onChange,
}: ScenarioFilterProps) {
  const { t, i18n } = useTranslation();
  const { api } = useDicecho();

  const handleReset = () => {
    onChange({
      rule: undefined,
      language: undefined,
      tags: undefined,
      tagsMode: undefined,
      players: undefined,
    });
  };

  // Search tags from API
  // Note: Using useCallback instead of useMutation because MultipleSelector
  // internally uses useQuery to manage caching and loading states
  const searchTags = useCallback(
    async (keyword: string) => {
      if (!keyword || keyword.trim() === "") {
        // When keyword is empty, return recommended hot tags
        const recommendTags = await api.tag.modRecommend();
        return recommendTags.map((tag) => ({
          value: tag.name,
          label: `${tag.name} (${tag.modCount})`,
        }));
      } else {
        // When keyword is provided, search by keyword
        const result = await api.search.tag({
          keyword,
          pageSize: 20,
        });
        return result.data.map((tag) => ({
          value: tag.name,
          label: `${tag.name} (${tag.modCount})`,
        }));
      }
    },
    [api],
  );

  // Convert tags to options
  const tagsValue: Option[] = (value.tags || []).map((tag) => ({
    value: tag,
    label: tag,
  }));

  // Convert players array to slider range [min, max]
  const playerRange = React.useMemo((): [number, number] => {
    if (!value.players || value.players.length === 0) return [1, 10];
    const sorted = [...value.players].sort((a, b) => a - b);
    return [sorted[0]!, sorted[sorted.length - 1]!];
  }, [value.players]);

  const handlePlayerRangeChange = (range: number[]) => {
    if (!range || range.length < 2) return;

    const min = range[0];
    const max = range[1];
    if (min === undefined || max === undefined) return;

    if (min === 1 && max === 10) {
      // Full range [1,10] = no filter
      onChange({ ...value, players: undefined });
    } else {
      // Generate array from min to max
      const players = Array.from({ length: max - min + 1 }, (_, i) => min + i);
      onChange({ ...value, players });
    }
  };

  const getPlayerRangeLabel = () => {
    const min = playerRange[0];
    const max = playerRange[1];

    if (min === 1 && max === 10) {
      return t("unlimited");
    } else if (min === 1) {
      return `≤ ${max} ${t("people")}`;
    } else if (max === 10) {
      return `≥ ${min} ${t("people")}`;
    } else {
      return `${min} - ${max} ${t("people")}`;
    }
  };

  return (
    <div className="space-y-4">
      <ButtonGroup orientation="horizontal" className="w-full min-w-0">
        <Select
          key={value.rule || "empty"}
          value={value.rule}
          onValueChange={(rule) => onChange({ ...value, rule })}
        >
          <SelectTrigger className="min-w-0 flex-1">
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
          key={value.language || "empty"}
          value={value.language}
          onValueChange={(language) => onChange({ ...value, language })}
        >
          <SelectTrigger className="min-w-0 flex-1">
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
        <MultipleSelector
          value={tagsValue}
          onSearch={searchTags}
          onChange={(options) =>
            onChange({
              ...value,
              tags: options.map((o) => o.value),
            })
          }
          hideClearAllButton
          hidePlaceholderWhenSelected
          placeholder={t("select_tags")}
          triggerSearchOnFocus
          emptyIndicator={
            <p className="text-muted-foreground text-center text-sm">
              {t("no_results")}
            </p>
          }
          className="min-w-0 flex-1"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            const newTagsMode =
              value.tagsMode === TagFilterMode.IN
                ? TagFilterMode.ALL
                : TagFilterMode.IN;
            onChange({ ...value, tagsMode: newTagsMode });
          }}
          className="shrink-0"
          title={
            value.tagsMode === TagFilterMode.IN
              ? t("tag_filter_mode_in")
              : t("tag_filter_mode_all")
          }
        >
          {value.tagsMode === TagFilterMode.IN
            ? t("tag_filter_mode_in")
            : t("tag_filter_mode_all")}
        </Button>
      </ButtonGroup>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {t("player_number_range")}
          </span>
          <div className="flex items-center gap-2">
            <span className="font-medium">{getPlayerRangeLabel()}</span>
            {(playerRange[0] !== 1 || playerRange[1] !== 10) && (
              <button
                type="button"
                onClick={() => {
                  onChange({ ...value, players: undefined });
                }}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <XCircle size={16} />
              </button>
            )}
          </div>
        </div>
        <Slider
          value={playerRange}
          onValueChange={handlePlayerRangeChange}
          min={1}
          max={10}
          step={1}
          minStepsBetweenThumbs={0}
          className="w-full"
        />
      </div>

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
