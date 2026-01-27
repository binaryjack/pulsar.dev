/**
 * Undo/Redo actions
 * Action creators for history navigation
 */
import type { IStoreAction } from '../store/store.types';
export declare const UndoRedoActions: {
    undo: () => IStoreAction;
    redo: () => IStoreAction;
    jump: (index: number) => IStoreAction;
};
