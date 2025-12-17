"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { useTranslation } from "@/lib/i18n/react";
import { cn } from "@/lib/utils";
import MultipleSelector, {
  type Option,
  type MultipleSelectorRef,
} from "@/components/ui/multiple-selector";
import {
  useScenarioSearchParams,
  getPlayerRange,
} from "./use-scenario-search-params";

export function ScenarioSearchInput({ className }: { className?: string }) {
  const { t } = useTranslation();
  const selectorRef = React.useRef<MultipleSelectorRef>(null);
  const [params, setParams] = useScenarioSearchParams();

  const keyword = params.keyword ?? "";

  // Build filter badges as Options and removal handlers separately
  const { filterBadges, removalHandlers } = React.useMemo(() => {
    const badges: Option[] = [];
    const handlers = new Map<string, () => void>();

    // Rule badge
    if (params.rule) {
      const value = `rule:${params.rule}`;
      badges.push({
        value,
        label: `${t("rule")}: ${params.rule}`,
      });
      handlers.set(value, () => setParams({ rule: null }));
    }

    // Language badge
    if (params.language) {
      const value = `language:${params.language}`;
      badges.push({
        value,
        label: `${t("language")}: ${t(`language_codes.${params.language}`)}`,
      });
      handlers.set(value, () => setParams({ language: null }));
    }

    // Players badge
    const [minPlayer, maxPlayer] = getPlayerRange(
      params.minPlayer,
      params.maxPlayer
    );
    if (params.minPlayer !== null || params.maxPlayer !== null) {
      const playerLabel =
        minPlayer === maxPlayer
          ? `${minPlayer} ${t("people")}`
          : `${minPlayer}-${maxPlayer} ${t("people")}`;
      const value = `players:${minPlayer}-${maxPlayer}`;
      badges.push({
        value,
        label: `${t("player_count")}: ${playerLabel}`,
      });
      handlers.set(value, () => setParams({ minPlayer: null, maxPlayer: null }));
    }

    // Tags badges
    if (params.tags && params.tags.length > 0) {
      params.tags.forEach((tag) => {
        const value = `tag:${tag}`;
        badges.push({
          value,
          label: `${t("tag")}: ${tag}`,
        });
        handlers.set(value, () =>
          setParams({
            tags: params.tags?.filter((t) => t !== tag) ?? null,
          })
        );
      });
    }

    // isForeign badge
    if (params.isForeign !== null) {
      const value = `isForeign:${params.isForeign}`;
      badges.push({
        value,
        label: params.isForeign
          ? t("filter_community_scenario")
          : t("filter_published_scenario"),
      });
      handlers.set(value, () => setParams({ isForeign: null }));
    }

    return { filterBadges: badges, removalHandlers: handlers };
  }, [params, t, setParams]);

  const handleBadgeChange = (options: Option[]) => {
    // Find removed badges and trigger their removal handlers
    const currentValues = new Set(options.map((opt) => opt.value));
    filterBadges.forEach((badge) => {
      if (!currentValues.has(badge.value)) {
        removalHandlers.get(badge.value)?.();
      }
    });
  };

  const doSearch = React.useCallback(() => {
    const inputValue = selectorRef.current?.input?.value?.trim() || "";
    setParams({ keyword: inputValue || null });
  }, [setParams]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    doSearch();
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      doSearch();
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex w-full items-center">
      <ButtonGroup orientation="horizontal" className={cn("w-full", className)}>
        <MultipleSelector
          ref={selectorRef}
          value={filterBadges}
          onChange={handleBadgeChange}
          placeholder={
            filterBadges.length > 0 ? "" : t("scenario_search_placeholder")
          }
          hidePlaceholderWhenSelected
          hideClearAllButton
          className="flex-1 rounded-r-none"
          defaultInputValue={keyword}
          onInputKeyDown={handleInputKeyDown}
        />
        <Button className="capitalize" color="primary" type="submit">
          <Search size={16} />
          {t("search")}
        </Button>
      </ButtonGroup>
    </form>
  );
}
