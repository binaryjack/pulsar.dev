/**
 * undoable reducer wrapper
 * Wraps a reducer to track history
 */

import type { IStoreAction, IStoreReducer } from '../store/store.types';
import type { IHistoryState, IUndoOptions } from './undo-redo.types';

export function undoable<T>(
  reducer: IStoreReducer<T>,
  options: IUndoOptions = {}
): IStoreReducer<IHistoryState<T>> {
  const { maxHistory = 50, filter = () => true } = options;

  return (state: IHistoryState<T>, action: IStoreAction): IHistoryState<T> => {
    const { past, present, future } = state;

    // Handle special undo/redo actions
    if (action.type === '@@UNDO') {
      if (past.length === 0) return state;

      const previous = past[past.length - 1];
      const newPast = past.slice(0, -1);

      return {
        past: newPast,
        present: previous,
        future: [present, ...future],
      };
    }

    if (action.type === '@@REDO') {
      if (future.length === 0) return state;

      const next = future[0];
      const newFuture = future.slice(1);

      return {
        past: [...past, present],
        present: next,
        future: newFuture,
      };
    }

    if (action.type === '@@JUMP') {
      const index = action.payload as number;
      if (index < 0 || index >= past.length) return state;

      return {
        past: past.slice(0, index),
        present: past[index],
        future: [...past.slice(index + 1), present, ...future],
      };
    }

    if (action.type === '@@HISTORY_UPDATE') {
      return action.payload as IHistoryState<T>;
    }

    // Apply reducer to present
    const newPresent = reducer(present, action);

    // Skip if state unchanged or action filtered
    if (newPresent === present || !filter(action)) {
      return state;
    }

    // Add to history
    const newPast = [...past, present];
    if (newPast.length > maxHistory) {
      newPast.shift();
    }

    return {
      past: newPast,
      present: newPresent,
      future: [], // Clear future on new action
    };
  };
}
