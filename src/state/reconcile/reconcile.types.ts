/**
 * Reconcile Types
 * Type definitions for the reconcile utility
 */

/**
 * Options for configuring the reconcile algorithm
 */
export interface IReconcileOptions<T = unknown> {
  /**
   * Key function for array reconciliation
   * Determines how to match items between old and new arrays
   * @default (item, index) => index
   */
  key?: string | ((item: T, index: number) => string | number);

  /**
   * Whether to merge objects (true) or replace them (false)
   * @default true
   */
  merge?: boolean;
}

/**
 * Result of comparing two values during reconciliation
 */
export type ReconcileResult<T> = {
  /**
   * The reconciled value (either reused or newly created)
   */
  value: T;

  /**
   * Whether any changes were detected
   */
  changed: boolean;
};

/**
 * Type guard for plain objects
 */
export type PlainObject = Record<string, any>;

/**
 * Type guard for arrays
 */
export type ArrayType<T> = T extends Array<infer U> ? U[] : never;
