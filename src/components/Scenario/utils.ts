import type { IModListQuery } from "@dicecho/types";
import type { FilterValue } from "./ScenarioFilter";
import qs from "qs";

function playersToQuery(players: Array<number>) {
  if (!players || players.length === 0) return {};
  const sortedList = players.sort((a, b) => a - b);
  return {
    minPlayer: sortedList[0],
    maxPlayer: sortedList[sortedList.length - 1],
  };
}

function queryToPlayers(query: {
  minPlayer?: number | string;
  maxPlayer?: number | string;
}): Array<number> {
  if (!query.minPlayer) return [];
  const min = parseInt(`${query.minPlayer}`);
  const max = parseInt(`${query.maxPlayer || query.minPlayer}`);
  const size = max - min + 1;
  return Array.from({ length: size }, (_, i) => i + min);
}

export function queryToFormData(query: Partial<IModListQuery>): FilterValue {
  return {
    rule: query.filter?.moduleRule,
    language: query.languages?.[0],
    tags: query.tags || [],
    tagsMode: query.tagsMode,
    players: queryToPlayers({
      minPlayer: query.minPlayer,
      maxPlayer: query.maxPlayer,
    }),
    isForeign: query.filter?.isForeign,
  };
}

export function formDataToQuery(data: FilterValue): Partial<IModListQuery> {
  const query: Partial<IModListQuery> = {};

  // Build filter object with both moduleRule and isForeign
  const filter: { moduleRule?: string; isForeign?: boolean } = {};
  if (data.rule) filter.moduleRule = data.rule;
  if (data.isForeign !== undefined) filter.isForeign = data.isForeign;

  if (Object.keys(filter).length > 0) {
    Object.assign(query, { filter });
  } else {
    Object.assign(query, { filter: undefined });
  }

  // Always set languages, even if empty (to explicitly remove it from URL)
  if (data.language) {
    Object.assign(query, {
      languages: [data.language],
    });
  } else {
    // Explicitly set to undefined to remove from URL
    Object.assign(query, { languages: undefined });
  }

  // Handle tags
  if (data.tags && data.tags.length > 0) {
    Object.assign(query, { tags: data.tags });
  } else {
    Object.assign(query, { tags: undefined });
  }

  // Handle tagsMode
  if (data.tagsMode) {
    Object.assign(query, { tagsMode: data.tagsMode });
  } else {
    Object.assign(query, { tagsMode: undefined });
  }

  // Handle players
  if (data.players && data.players.length > 0) {
    Object.assign(query, playersToQuery(data.players));
  } else {
    Object.assign(query, { minPlayer: undefined, maxPlayer: undefined });
  }

  return query;
}

export function getScenarioFilterQuery(
  searchParams: string,
): Partial<IModListQuery> {
  const parsedParams = qs.parse(searchParams, {
    decoder(value, defaultDecoder) {
      // First decode the URL-encoded value
      const decoded = defaultDecoder(value);
      // Convert numeric strings to numbers
      if (/^-?\d+$/.test(decoded)) {
        return parseInt(decoded, 10);
      }
      // Convert boolean strings to booleans
      if (decoded === "true") return true;
      if (decoded === "false") return false;
      return decoded;
    },
  });

  return {
    ...parsedParams,
  };
}
