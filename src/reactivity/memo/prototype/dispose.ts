import { IMemoInternal } from '../../types';
import { IMemo } from '../memo.types';

/**
 * Disposes the memo and clears cached value
 * ENTERPRISE-GRADE FIX: Properly cleans up memoEffect subscriptions
 */
export const dispose = function <T>(this: IMemo<T>): void {
  const internal = this as unknown as IMemoInternal<T>;

  // Clean up memoEffect subscriptions
  if (internal.memoEffect) {
    internal.memoEffect.dispose();
    internal.memoEffect = undefined;
  }

  // Clear dependencies
  internal.dependencies.clear();

  // Reset state
  internal.cachedValue = undefined;
  internal.isDirty = true;
};
