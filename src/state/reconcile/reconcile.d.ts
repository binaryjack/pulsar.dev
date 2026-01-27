/**
 * Reconcile - Efficient Immutable State Updates
 * Minimizes object creation by reusing unchanged values
 */
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
export declare function reconcile<T>(newValue: T, options?: IReconcileOptions): (prevValue: T) => T;
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
export declare function reconcileWith<T>(newValue: T[], key: string | ((item: T, index: number) => string | number)): (prevValue: T[]) => T[];
