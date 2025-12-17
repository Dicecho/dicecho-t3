"use client";

import { useQueryStates } from "nuqs";
import type { TagFilterMode } from "@dicecho/types";
import { scenarioSearchParams, type ScenarioSearchParams } from "./scenario-search-params";

// Type for ScenarioFilter component's value prop
export interface FilterValue {
  rule?: string;
  language?: string;
  tags?: string[];
  tagsMode?: TagFilterMode;
  players?: number[];
  isForeign?: boolean;
}

// Re-export the type from scenario-search-params for convenience
export type ScenarioParams = ScenarioSearchParams;

// Client-side hook for managing scenario search params
export function useScenarioSearchParams() {
  return useQueryStates(scenarioSearchParams, {
    history: "push",
    shallow: false, // Trigger server re-render
  });
}

// Helper to get player range from min/max
export function getPlayerRange(
  minPlayer: number | null,
  maxPlayer: number | null
): [number, number] {
  const min = minPlayer ?? 1;
  const max = maxPlayer ?? 10;
  return [min, max];
}

// Helper to convert player range to min/max params
export function playerRangeToParams(range: [number, number]) {
  const [min, max] = range;
  // If full range, return null to clear params
  if (min === 1 && max === 10) {
    return { minPlayer: null, maxPlayer: null };
  }
  return { minPlayer: min, maxPlayer: max };
}

// Convert nuqs params to FilterValue (for ScenarioFilter)
export function paramsToFilterValue(params: Partial<ScenarioParams>): FilterValue {
  const players: number[] = [];
  if (params.minPlayer !== null && params.minPlayer !== undefined) {
    const min = params.minPlayer;
    const max = params.maxPlayer ?? min;
    for (let i = min; i <= max; i++) {
      players.push(i);
    }
  }

  return {
    rule: params.rule ?? undefined,
    language: params.language ?? undefined,
    tags: params.tags ?? undefined,
    tagsMode: params.tagsMode ?? undefined,
    players: players.length > 0 ? players : undefined,
    isForeign: params.isForeign ?? undefined,
  };
}

// Convert FilterValue to nuqs params updates
export function filterValueToParams(value: FilterValue): Partial<ScenarioParams> {
  const { minPlayer, maxPlayer } = value.players?.length
    ? playerRangeToParams([
        Math.min(...value.players),
        Math.max(...value.players),
      ])
    : { minPlayer: null, maxPlayer: null };

  return {
    rule: value.rule ?? null,
    language: value.language ?? null,
    tags: value.tags?.length ? value.tags : null,
    tagsMode: value.tagsMode ?? null,
    minPlayer,
    maxPlayer,
    isForeign: value.isForeign ?? null,
  };
}
