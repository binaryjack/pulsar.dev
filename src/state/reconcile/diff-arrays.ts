/**
 * Array Diffing Utility
 * Efficient reconciliation of arrays with key-based matching
 */

import { diffObjects, isPlainObject } from './diff-objects';
import { IReconcileOptions, ReconcileResult } from './reconcile.types';

/**
 * Diff and reconcile two arrays
 * Uses key-based matching to reuse unchanged items
 *
 * @param prev - Previous array
 * @param next - New array
 * @param options - Reconcile options
 * @returns Reconciled array and change flag
 */
export function diffArrays<T>(
  prev: T[],
  next: T[],
  options: IReconcileOptions = {}
): ReconcileResult<T[]> {
  // Quick equality check
  if (prev === next) {
    return { value: prev, changed: false };
  }

  // Handle null/undefined
  if (!prev || !next) {
    return { value: next, changed: true };
  }

  // Empty arrays
  if (prev.length === 0 && next.length === 0) {
    return { value: prev, changed: false };
  }

  // Quick check: if only one is empty
  if (prev.length === 0 || next.length === 0) {
    return { value: next, changed: true };
  }

  const { key = (_item: T, index: number) => index, merge = true } = options;

  // Build map of previous items by their key (not by index)
  const prevMap = new Map<any, T>();
  for (let i = 0; i < prev.length; i++) {
    const prevItem = prev[i];
    // Get the actual key value for this item (not the index when building the map)
    const itemKey =
      typeof key === 'string'
        ? (prevItem as any)?.[key]
        : typeof key === 'function'
          ? key(prevItem, i)
          : i;
    prevMap.set(itemKey, prevItem);
  }

  let changed = false;
  const result: T[] = [];

  // Process new array
  for (let i = 0; i < next.length; i++) {
    const nextItem = next[i];
    // Get the actual key value for this item to look up in prevMap
    const itemKey =
      typeof key === 'string'
        ? (nextItem as any)?.[key]
        : typeof key === 'function'
          ? key(nextItem, i)
          : i;
    const prevItem = prevMap.get(itemKey);

    // Item not found in previous array - new item
    if (prevItem === undefined) {
      result.push(nextItem);
      changed = true;
      continue;
    }

    // Check if item moved (different index)
    if (prev[i] !== prevItem) {
      changed = true;
    }

    // Item found - check if it changed
    if (prevItem === nextItem) {
      // Exact same reference - reuse
      result.push(prevItem);
      continue;
    }

    // Objects - try to reconcile
    if (isPlainObject(prevItem) && isPlainObject(nextItem)) {
      const reconciled = diffObjects(
        prevItem as Record<string, any>,
        nextItem as Record<string, any>,
        merge
      );
      result.push(reconciled.value as T);
      if (reconciled.changed) {
        changed = true;
      }
      continue;
    }

    // Primitives or non-plain objects - just compare
    if (prevItem !== nextItem) {
      result.push(nextItem);
      changed = true;
    } else {
      result.push(prevItem);
    }
  }

  // Check if length changed
  if (prev.length !== next.length) {
    changed = true;
  }

  // If nothing changed, return previous reference
  return {
    value: changed ? result : prev,
    changed,
  };
}
