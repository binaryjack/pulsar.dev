/**
 * SSR Context Creation
 */

import type { ISSRContext } from './ssr.types';

/**
 * Create an SSR context for server rendering
 */
export const createSSRContext = function createSSRContext(
  options: Partial<ISSRContext> = {}
): ISSRContext {
  return {
    url: options.url || '/',
    request: options.request,
    response: options.response,
    data: options.data || {},
    styles: options.styles || [],
    scripts: options.scripts || [],
    isServer: true,
  };
};
