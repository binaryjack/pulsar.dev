/**
 * ⚠️ IMPERATIVE HANDLE ESCAPE HATCH
 *
 * This module provides an escape hatch for rare cases where declarative
 * patterns are not feasible. Use with extreme caution and only after
 * exploring all declarative alternatives.
 *
 * @module imperative-handle
 */

export { createImperativeHandle } from './create-imperative-handle';
export type {
  IImperativeHandle,
  IImperativeHandleConfig,
  IImperativeHandleMetadata,
  ImperativeHandleUseCase,
} from './imperative-handle.types';
