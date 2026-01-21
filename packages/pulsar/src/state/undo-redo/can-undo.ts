/**
 * canUndo helper
 * Check if undo is available
 */

import type { IHistoryState } from './undo-redo.types';

export function canUndo<T>(state: IHistoryState<T>): boolean {
  return state.past.length > 0;
}
