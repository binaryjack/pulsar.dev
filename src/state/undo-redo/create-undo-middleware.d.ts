/**
 * createUndoMiddleware factory
 * Middleware for time-travel debugging
 */
import type { IStoreMiddleware } from '../store/store.types';
import type { IHistoryState, IUndoMiddlewareOptions } from './undo-redo.types';
export declare function createUndoMiddleware<T>(options?: IUndoMiddlewareOptions): IStoreMiddleware<IHistoryState<T>>;
