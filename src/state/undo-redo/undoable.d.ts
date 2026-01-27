/**
 * undoable reducer wrapper
 * Wraps a reducer to track history
 */
import type { IStoreReducer } from '../store/store.types';
import type { IHistoryState, IUndoOptions } from './undo-redo.types';
export declare function undoable<T>(reducer: IStoreReducer<T>, options?: IUndoOptions): IStoreReducer<IHistoryState<T>>;
