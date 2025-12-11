import type { IModListQuery, ModSortKey, TagFilterMode } from '@dicecho/types';
import type { FilterValue } from './ScenarioFilter'

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
    sortKey: Object.keys(query.sort ?? { lastRateAt: "-1" })[0] as ModSortKey,
    sortOrder: Object.values(query.sort ?? { lastRateAt: "-1" })[0] as string,
    tags: query.tags || [],
    tagsMode: query.tagsMode,
    players: queryToPlayers({
      minPlayer: query.minPlayer,
      maxPlayer: query.maxPlayer,
    }),
  };
}

export function formDataToQuery(data: FilterValue): Partial<IModListQuery> {
  const query: Partial<IModListQuery> = {};

  // Always set filter, even if empty (to explicitly remove it from URL)
  if (data.rule) {
    Object.assign(query, {
      filter: {
        moduleRule: data.rule,
      },
    });
  } else {
    // Explicitly set to undefined to remove from URL
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

  if (data.sortKey && data.sortOrder) {
    Object.assign(query, {
      sort: {
        [data.sortKey]: data.sortOrder,
      },
    });
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