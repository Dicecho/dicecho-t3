/**
 * Translation Cache Service
 *
 * Design principles:
 * 1. Simple interface - get/set/has three methods
 * 2. Replaceable storage - currently using in-memory Map, can switch to Redis/DB in the future
 * 3. Key design - combination of rateId + targetLanguage
 */

// ============================================
// Types
// ============================================

export interface TranslationCacheEntry {
  translatedText: string;
  translatedAt: Date;
  targetLanguage: string;
}

export interface TranslationCacheStore {
  get(key: string): Promise<TranslationCacheEntry | null>;
  set(key: string, entry: TranslationCacheEntry): Promise<void>;
  has(key: string): Promise<boolean>;
}

// ============================================
// Memory Store Implementation
// ============================================

const createMemoryStore = (): TranslationCacheStore => {
  const cache = new Map<string, TranslationCacheEntry>();

  return {
    async get(key: string) {
      return cache.get(key) ?? null;
    },
    async set(key: string, entry: TranslationCacheEntry) {
      cache.set(key, entry);
    },
    async has(key: string) {
      return cache.has(key);
    },
  };
};

// ============================================
// Cache Key Builder
// ============================================

export function buildCacheKey(rateId: string, targetLanguage: string): string {
  return `rate:${rateId}:${targetLanguage}`;
}

// ============================================
// Singleton Store
// ============================================

let cacheStore: TranslationCacheStore | null = null;

export function getTranslationCache(): TranslationCacheStore {
  if (!cacheStore) {
    // Currently using in-memory store, can switch to Redis/MongoDB based on configuration in the future
    cacheStore = createMemoryStore();
  }
  return cacheStore;
}

// ============================================
// Public API
// ============================================

/**
 * Get cached translation
 */
export async function getCachedTranslation(
  rateId: string,
  targetLanguage: string
): Promise<TranslationCacheEntry | null> {
  const cache = getTranslationCache();
  const key = buildCacheKey(rateId, targetLanguage);
  return cache.get(key);
}

/**
 * Set cached translation
 */
export async function setCachedTranslation(
  rateId: string,
  targetLanguage: string,
  translatedText: string,
): Promise<void> {
  const cache = getTranslationCache();
  const key = buildCacheKey(rateId, targetLanguage);
  await cache.set(key, {
    translatedText,
    translatedAt: new Date(),
    targetLanguage,
  });
}

/**
 * Check if translation is cached
 */
export async function hasCachedTranslation(
  rateId: string,
  targetLanguage: string
): Promise<boolean> {
  const cache = getTranslationCache();
  const key = buildCacheKey(rateId, targetLanguage);
  return cache.has(key);
}
