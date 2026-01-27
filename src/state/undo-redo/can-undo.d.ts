/**
 * canUndo helper
 * Check if undo is available
 */
import type { IHistoryState } from './undo-redo.types';
export declare function canUndo<T>(state: IHistoryState<T>): boolean;
