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
  if (data.rule) {
    Object.assign(query, {
      filter: {
        moduleRule: data.rule,
      },
    });
  }

  if (data.language) {
    Object.assign(query, {
      languages: [data.language],
    });
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