/**
 * Clear cache entries
 */

import { clearCacheEntries } from '../cache/memory-cache';
import type { IHttpClientInternal } from '../http-client.types';

export function clearCache(this: IHttpClientInternal, keyOrPattern?: string): void {
  clearCacheEntries(this.cache, keyOrPattern);
}
