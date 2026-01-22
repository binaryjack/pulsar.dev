/**
 * getHistoryMetadata helper
 * Get history statistics
 */

import type { IHistoryState } from './undo-redo.types';

export interface IHistoryMetadata {
  pastSize: number;
  futureSize: number;
  canUndo: boolean;
  canRedo: boolean;
}

export function getHistoryMetadata<T>(state: IHistoryState<T>): IHistoryMetadata {
  return {
    pastSize: state.past.length,
    futureSize: state.future.length,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
  };
}
