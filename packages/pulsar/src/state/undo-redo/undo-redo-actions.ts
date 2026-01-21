/**
 * Undo/Redo actions
 * Action creators for history navigation
 */

import type { IStoreAction } from '../store/store.types';

export const UndoRedoActions = {
  undo: (): IStoreAction => ({ type: '@@UNDO' }),
  redo: (): IStoreAction => ({ type: '@@REDO' }),
  jump: (index: number): IStoreAction => ({ type: '@@JUMP', payload: index }),
};
