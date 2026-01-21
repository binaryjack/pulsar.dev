/**
 * createUndoMiddleware factory
 * Middleware for time-travel debugging
 */

import type { IStoreAction, IStoreMiddleware } from '../store/store.types';
import type { IHistoryState, IUndoMiddlewareOptions } from './undo-redo.types';

export function createUndoMiddleware<T>(
  options: IUndoMiddlewareOptions = {}
): IStoreMiddleware<IHistoryState<T>> {
  const { maxHistory = 50, filter = () => true, groupBy, debounce = 0 } = options;

  let lastActionTime = 0;
  let lastGroup: string | null = null;

  return (store) => (next) => (action: IStoreAction) => {
    const state = store.getState();

    // Handle undo/redo actions
    if (action.type === '@@UNDO') {
      if (state.past.length === 0) return;

      const previous = state.past[state.past.length - 1];
      const newPast = state.past.slice(0, -1);

      store.dispatch({
        type: '@@HISTORY_UPDATE',
        payload: {
          past: newPast,
          present: previous,
          future: [state.present, ...state.future],
        },
      } as any);
      return;
    }

    if (action.type === '@@REDO') {
      if (state.future.length === 0) return;

      const next = state.future[0];
      const newFuture = state.future.slice(1);

      store.dispatch({
        type: '@@HISTORY_UPDATE',
        payload: {
          past: [...state.past, state.present],
          present: next,
          future: newFuture,
        },
      } as any);
      return;
    }

    if (action.type === '@@JUMP') {
      const index = action.payload as number;
      if (index < 0 || index >= state.past.length) return;

      const target = state.past[index];
      const newPast = state.past.slice(0, index);
      const newFuture = [...state.past.slice(index + 1), state.present, ...state.future];

      store.dispatch({
        type: '@@HISTORY_UPDATE',
        payload: {
          past: newPast,
          present: target,
          future: newFuture,
        },
      } as any);
      return;
    }

    // Skip internal history updates
    if (action.type === '@@HISTORY_UPDATE') {
      next(action);
      return;
    }

    // Filter unwanted actions
    if (!filter(action)) {
      next(action);
      return;
    }

    // Group actions if needed
    const now = Date.now();
    const group = groupBy ? groupBy(action) : null;
    const shouldGroup = group && group === lastGroup && now - lastActionTime < debounce;

    if (!shouldGroup) {
      // Add current state to history
      const newPast = [...state.past, state.present];
      if (newPast.length > maxHistory) {
        newPast.shift();
      }

      next({
        ...action,
        meta: {
          ...action,
          past: newPast,
          future: [], // Clear future on new action
        },
      } as any);
    } else {
      // Group with previous action
      next(action);
    }

    lastActionTime = now;
    lastGroup = group;
  };
}
