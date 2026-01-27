/**
 * canRedo helper
 * Check if redo is available
 */
import type { IHistoryState } from './undo-redo.types';
export declare function canRedo<T>(state: IHistoryState<T>): boolean;
