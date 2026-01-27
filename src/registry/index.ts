/**
 * Element Registry - Public API
 *
 * Tracks reactive elements for lifecycle management, context propagation,
 * and portal rendering.
 */

// Core registry
export { ElementRegistry } from './core';
export type { IElementRegistry } from './core';

// Types
export { ElementType } from './types';
export type { IElementEntry, IElementMetadata } from './types';

// ID Generator
export {
  createIdContext,
  decodeBase36,
  encodeBase36,
  generateId,
  getGeneration,
  getParentId,
  incrementGeneration,
  isArrayItemId,
  parseId,
  resetFragmentCounter,
} from './id-generator';
export type { IIdGenerationContext, IParsedId } from './id-generator';

// Reconciliation
export { ReconciliationOp, getOpsByType, hasChanges, reconcileArray } from './reconciliation';
export type { IReconciliationOp, IReconciliationResult, KeyExtractor } from './reconciliation';
