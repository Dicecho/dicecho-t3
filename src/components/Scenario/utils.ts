import type { IModListQuery, ModSortKey } from '@dicecho/types';
import type { FormData } from './ScenarioFilter'

export function queryToFormData(query: Partial<IModListQuery>): FormData {
  return {
    rule: query.filter?.moduleRule,
    language: query.languages?.[0],
    sortKey: Object.keys(query.sort ?? { lastRateAt: "-1" })[0] as ModSortKey,
    sortOrder: Object.values(query.sort ?? { lastRateAt: "-1" })[0] as string,
  };
}

export function formDataToQuery(data: FormData): Partial<IModListQuery> {
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

  return query;
}