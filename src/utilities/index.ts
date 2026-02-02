/**
 * Utility functions for Pulsar Framework
 */

export { produce } from './produce';
export type {} from './produce';

// ⚠️ Imperative Handle - Escape hatch for browser APIs
// See ./imperative-handle/README.md for valid use cases
export { createImperativeHandle } from './imperative-handle';
export type {
  IImperativeHandle,
  IImperativeHandleConfig,
  IImperativeHandleMetadata,
  ImperativeHandleUseCase,
} from './imperative-handle';
