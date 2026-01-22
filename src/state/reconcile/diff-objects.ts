/**
 * Object Diffing Utility
 * Efficient comparison and merging of plain objects
 */

import { PlainObject, ReconcileResult } from './reconcile.types';

/**
 * Check if a value is a plain object
 * @param value - Value to check
 * @returns True if the value is a plain object
 */
export function isPlainObject(value: unknown): value is PlainObject {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const proto = Object.getPrototypeOf(value);
  return proto === null || proto === Object.prototype;
}

/**
 * Diff and reconcile two objects
 * Reuses unchanged values to minimize object creation
 *
 * @param prev - Previous object value
 * @param next - New object value
 * @param merge - Whether to merge objects (true) or replace them (false)
 * @returns Reconciled object and change flag
 */
export function diffObjects<T extends PlainObject>(
  prev: T,
  next: T,
  merge: boolean
): ReconcileResult<T> {
  // Quick equality check
  if (prev === next) {
    return { value: prev, changed: false };
  }

  // Handle null/undefined
  if (!prev || !next) {
    return { value: next, changed: true };
  }

  // If not merging, just return the new value
  if (!merge) {
    return { value: next, changed: true };
  }

  // Get all keys from both objects
  const prevKeys = Object.keys(prev);
  const nextKeys = Object.keys(next);

  // Quick check: if key counts differ, definitely changed
  const allKeys = new Set([...prevKeys, ...nextKeys]);

  let changed = false;
  const result: PlainObject = {};

  // Check each key
  for (const key of allKeys) {
    const prevValue = prev[key];
    const nextValue = next[key];

    // Key was removed
    if (!(key in next)) {
      changed = true;
      continue;
    }

    // Key was added
    if (!(key in prev)) {
      result[key] = nextValue;
      changed = true;
      continue;
    }

    // Value unchanged - reuse reference
    if (prevValue === nextValue) {
      result[key] = prevValue;
      continue;
    }

    // Nested object - recurse
    if (isPlainObject(prevValue) && isPlainObject(nextValue)) {
      const nested = diffObjects(prevValue, nextValue, merge);
      result[key] = nested.value;
      if (nested.changed) {
        changed = true;
      }
      continue;
    }

    // Value changed
    result[key] = nextValue;
    changed = true;
  }

  // If nothing changed, return previous reference
  return {
    value: changed ? (result as T) : prev,
    changed,
  };
}
