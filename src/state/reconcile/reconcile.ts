/**
 * Reconcile - Efficient Immutable State Updates
 * Minimizes object creation by reusing unchanged values
 */

import { diffArrays } from './diff-arrays';
import { diffObjects, isPlainObject } from './diff-objects';
import { IReconcileOptions } from './reconcile.types';

/**
 * Reconcile new state with previous state
 *
 * This function performs efficient immutable updates by:
 * 1. Deep comparing old and new values
 * 2. Reusing unchanged object/array references
 * 3. Only creating new objects where values actually changed
 *
 * This minimizes unnecessary re-renders by preserving referential equality
 * for unchanged parts of the state tree.
 *
 * @param newValue - New value to reconcile
 * @param options - Reconcile options
 * @returns Function that takes previous value and returns reconciled value
 *
 * @example
 * ```typescript
 * // Basic object reconciliation
 * const [state, setState] = createSignal({ count: 0, name: 'Alice' })
 *
 * setState(reconcile({ count: 1, name: 'Alice' }))
 * // Result: new object, but 'name' property reuses same reference
 *
 * // Array reconciliation with key
 * setState('users', reconcile(newUsers, { key: 'id' }))
 * // Result: unchanged users reuse previous object references
 * ```
 */
export function reconcile<T>(newValue: T, options: IReconcileOptions = {}): (prevValue: T) => T {
  const { merge = true } = options;

  return (prevValue: T): T => {
    // Quick equality check
    if (prevValue === newValue) {
      return prevValue;
    }

    // Handle null/undefined
    if (prevValue === null || prevValue === undefined) {
      return newValue;
    }
    if (newValue === null || newValue === undefined) {
      return newValue;
    }

    // Handle arrays
    if (Array.isArray(prevValue) && Array.isArray(newValue)) {
      const result = diffArrays(prevValue, newValue, options);
      return result.changed ? (result.value as T) : prevValue;
    }

    // Handle plain objects
    if (isPlainObject(prevValue) && isPlainObject(newValue)) {
      const result = diffObjects(
        prevValue as Record<string, any>,
        newValue as Record<string, any>,
        merge
      );
      return result.changed ? (result.value as T) : prevValue;
    }

    // Primitives or other types - just return new value
    return newValue;
  };
}

/**
 * Reconcile with custom key function (convenience for arrays)
 *
 * @param newValue - New array value
 * @param key - Key property name or function
 * @returns Function that takes previous array and returns reconciled array
 *
 * @example
 * ```typescript
 * // Using key property
 * setState('users', reconcileWith(newUsers, 'id'))
 *
 * // Using key function
 * setState('items', reconcileWith(newItems, item => item.uid))
 * ```
 */
export function reconcileWith<T>(
  newValue: T[],
  key: string | ((item: T, index: number) => string | number)
): (prevValue: T[]) => T[] {
  return reconcile(newValue, {
    key: key as string | ((item: unknown, index: number) => string | number),
    merge: true,
  });
}
