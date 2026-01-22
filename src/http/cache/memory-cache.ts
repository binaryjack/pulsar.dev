/**
 * In-memory cache operations
 */

import type { ICacheEntry, IHttpResponse } from '../http-client.types';

/**
 * Get cached response if still valid
 */
export function getCachedResponse(
  cache: Map<string, ICacheEntry>,
  key: string
): IHttpResponse | null {
  const entry = cache.get(key);

  if (!entry) {
    return null;
  }

  // Check if cache entry has expired
  const now = Date.now();
  const age = now - entry.timestamp;

  if (age > entry.ttl) {
    // Expired - remove from cache
    cache.delete(key);
    return null;
  }

  // Mark as from cache
  return {
    ...entry.data,
    fromCache: true,
  };
}

/**
 * Store response in cache
 */
export function setCachedResponse(
  cache: Map<string, ICacheEntry>,
  key: string,
  response: IHttpResponse,
  ttl: number
): void {
  cache.set(key, {
    data: response,
    timestamp: Date.now(),
    ttl,
  });
}

/**
 * Clear cache entries by key or pattern
 */
export function clearCacheEntries(cache: Map<string, ICacheEntry>, keyOrPattern?: string): void {
  if (!keyOrPattern) {
    // Clear all
    cache.clear();
    return;
  }

  // Check if it's a direct key
  if (cache.has(keyOrPattern)) {
    cache.delete(keyOrPattern);
    return;
  }

  // Treat as pattern (simple string matching)
  const keys = Array.from(cache.keys());
  for (const key of keys) {
    if (key.includes(keyOrPattern)) {
      cache.delete(key);
    }
  }
}
