import type { ICoreRegistry } from '../registry.types';

/**
 * Generate next hydration ID for SSR
 * Returns current counter then increments it
 */
export const nextHid = function (this: ICoreRegistry): number {
  return this._hidCounter++;
};
