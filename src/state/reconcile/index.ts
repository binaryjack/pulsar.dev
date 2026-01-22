/**
 * Reconcile - Efficient Immutable State Updates
 *
 * This module provides utilities for efficient immutable state updates
 * by minimizing object creation through deep comparison and reference reuse.
 */

export { diffArrays } from './diff-arrays';
export { diffObjects, isPlainObject } from './diff-objects';
export { reconcile, reconcileWith } from './reconcile';
export type { IReconcileOptions, PlainObject, ReconcileResult } from './reconcile.types';
