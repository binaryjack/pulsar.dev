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
export declare function getHistoryMetadata<T>(state: IHistoryState<T>): IHistoryMetadata;
