/**
 * Undo/Redo type definitions
 */

import type { IStoreAction, IStoreMiddleware } from '../store/store.types';

export interface IHistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}

export interface IUndoOptions {
  maxHistory?: number;
  filter?: (action: IStoreAction) => boolean;
  groupBy?: (action: IStoreAction) => string | null;
  debounce?: number;
}

export interface IUndoMiddlewareOptions extends IUndoOptions {}

export type UndoMiddleware<T> = IStoreMiddleware<IHistoryState<T>>;
