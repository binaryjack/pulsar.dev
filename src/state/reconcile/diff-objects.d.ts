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
export declare function isPlainObject(value: unknown): value is PlainObject;
/**
 * Diff and reconcile two objects
 * Reuses unchanged values to minimize object creation
 *
 * @param prev - Previous object value
 * @param next - New object value
 * @param merge - Whether to merge objects (true) or replace them (false)
 * @returns Reconciled object and change flag
 */
export declare function diffObjects<T extends PlainObject>(prev: T, next: T, merge: boolean): ReconcileResult<T>;
