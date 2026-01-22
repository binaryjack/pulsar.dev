/**
 * canRedo helper
 * Check if redo is available
 */

import type { IHistoryState } from './undo-redo.types';

export function canRedo<T>(state: IHistoryState<T>): boolean {
  return state.future.length > 0;
}
