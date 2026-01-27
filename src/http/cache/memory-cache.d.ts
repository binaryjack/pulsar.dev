/**
 * In-memory cache operations
 */
import type { ICacheEntry, IHttpResponse } from '../http-client.types';
/**
 * Get cached response if still valid
 */
export declare function getCachedResponse(cache: Map<string, ICacheEntry>, key: string): IHttpResponse | null;
/**
 * Store response in cache
 */
export declare function setCachedResponse(cache: Map<string, ICacheEntry>, key: string, response: IHttpResponse, ttl: number): void;
/**
 * Clear cache entries by key or pattern
 */
export declare function clearCacheEntries(cache: Map<string, ICacheEntry>, keyOrPattern?: string): void;
