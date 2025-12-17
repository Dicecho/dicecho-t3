import {
  parseAsString,
  parseAsInteger,
  parseAsBoolean,
  parseAsArrayOf,
  parseAsStringLiteral,
  createSearchParamsCache,
  createSerializer,
} from "nuqs/server";
import { ModSortKey, SortOrder, TagFilterMode, type IModListQuery } from "@dicecho/types";

// Sort keys
const sortKeys = [
  ModSortKey.RELEASE_DATE,
  ModSortKey.RATE_COUNT,
  ModSortKey.RATE_AVG,
  ModSortKey.LAST_RATE_AT,
  ModSortKey.LAST_EDIT_AT,
  ModSortKey.CREATED_AT,
  ModSortKey.UPDATED_AT,
] as const;

const tagsModes = [TagFilterMode.IN, TagFilterMode.ALL] as const;

// Define all scenario search params parsers
export const scenarioSearchParams = {
  // Search keyword
  keyword: parseAsString,

  // Filter params
  rule: parseAsString,
  language: parseAsString,
  tags: parseAsArrayOf(parseAsString, ","),
  tagsMode: parseAsStringLiteral(tagsModes),
  minPlayer: parseAsInteger,
  maxPlayer: parseAsInteger,
  isForeign: parseAsBoolean,

  // Sort params
  sortKey: parseAsStringLiteral(sortKeys).withDefault(ModSortKey.LAST_RATE_AT),
  sortOrder: parseAsInteger.withDefault(SortOrder.DESC),
};

// Create search params cache for server components
export const scenarioSearchParamsCache =
  createSearchParamsCache(scenarioSearchParams);

// Create serializer for URL generation
export const serializeScenarioParams = createSerializer(scenarioSearchParams);

// Type for the parsed search params
export type ScenarioSearchParams = Awaited<
  ReturnType<typeof scenarioSearchParamsCache.parse>
>;

// Convert nuqs params to IModListQuery for API calls
export function paramsToQuery(params: ScenarioSearchParams): Partial<IModListQuery> {
  const query: Partial<IModListQuery> = {};

  // Build filter object
  const filter: { moduleRule?: string; isForeign?: boolean } = {};
  if (params.rule) filter.moduleRule = params.rule;
  if (params.isForeign !== null) filter.isForeign = params.isForeign;

  if (Object.keys(filter).length > 0) {
    query.filter = filter;
  }

  // Handle keyword
  if (params.keyword) {
    query.keyword = params.keyword;
  }

  // Handle language
  if (params.language) {
    query.languages = [params.language];
  }

  // Handle tags
  if (params.tags && params.tags.length > 0) {
    query.tags = params.tags;
  }

  // Handle tagsMode
  if (params.tagsMode) {
    query.tagsMode = params.tagsMode;
  }

  // Handle players
  if (params.minPlayer !== null) {
    query.minPlayer = params.minPlayer;
  }
  if (params.maxPlayer !== null) {
    query.maxPlayer = params.maxPlayer;
  }

  // Handle sort
  query.sort = {
    [params.sortKey]: params.sortOrder,
  };

  return query;
}
