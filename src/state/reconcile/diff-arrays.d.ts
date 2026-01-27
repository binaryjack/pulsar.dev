/**
 * Array Diffing Utility
 * Efficient reconciliation of arrays with key-based matching
 */
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
export declare function diffArrays<T>(prev: T[], next: T[], options?: IReconcileOptions): ReconcileResult<T[]>;
