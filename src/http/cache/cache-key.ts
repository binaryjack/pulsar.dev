/**
 * Generate cache key from request configuration
 */

import type { IHttpRequestConfig } from '../http-client.types';

export function generateCacheKey(config: IHttpRequestConfig): string {
  // Create a stable cache key from URL, method, and body
  const parts: string[] = [config.method, config.url];

  // Include body for POST/PUT/PATCH requests in cache key
  if (
    config.body &&
    (config.method === 'POST' || config.method === 'PUT' || config.method === 'PATCH')
  ) {
    const bodyString = typeof config.body === 'string' ? config.body : JSON.stringify(config.body);
    parts.push(bodyString);
  }

  return parts.join('::');
}
