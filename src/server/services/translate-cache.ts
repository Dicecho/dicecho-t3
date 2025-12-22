/**
 * Translation Cache Service
 *
 * Design principles:
 * 1. Simple interface - get/set/has three methods
 * 2. Replaceable storage - currently using in-memory Map, can switch to Redis/DB in the future
 * 3. Key design - content hash + targetLanguage (content-addressed cache)
 * 4. Content-addressed - same content always gets same translation, auto-invalidates on change
 */

import { createHash } from "crypto";

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
// Content Hash
// ============================================

/**
 * Generate a hash from content for cache key.
 * Uses SHA-256 truncated to 16 chars for reasonable uniqueness without bloating keys.
 */
export function hashContent(content: string): string {
  return createHash("sha256").update(content).digest("hex").slice(0, 16);
}

// ============================================
// Cache Key Builder
// ============================================

export function buildCacheKey(contentHash: string, targetLanguage: string): string {
  return `${contentHash}:${targetLanguage}`;
}

// ============================================
// Singleton Store
// ============================================

let cacheStore: TranslationCacheStore | null = null;

export function getTranslationCacheStore(): TranslationCacheStore {
  if (!cacheStore) {
    // Currently using in-memory store, can switch to Redis/MongoDB based on configuration in the future
    cacheStore = createMemoryStore();
  }
  return cacheStore;
}

// ============================================
// Translation Cache API
// ============================================

const translationCache = {
  /**
   * Get cached translation by content
   */
  async get(
    content: string,
    targetLanguage: string
  ): Promise<TranslationCacheEntry | null> {
    const store = getTranslationCacheStore();
    const key = buildCacheKey(hashContent(content), targetLanguage);
    return store.get(key);
  },

  /**
   * Set cached translation for content
   */
  async set(
    content: string,
    targetLanguage: string,
    translatedText: string
  ): Promise<void> {
    const store = getTranslationCacheStore();
    const key = buildCacheKey(hashContent(content), targetLanguage);
    await store.set(key, {
      translatedText,
      translatedAt: new Date(),
      targetLanguage,
    });
  },

  /**
   * Check if translation exists for content
   */
  async has(content: string, targetLanguage: string): Promise<boolean> {
    const store = getTranslationCacheStore();
    const key = buildCacheKey(hashContent(content), targetLanguage);
    return store.has(key);
  },
};

export function getTranslationCache() {
  return translationCache;
}
