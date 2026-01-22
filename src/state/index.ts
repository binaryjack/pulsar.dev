/**
 * State Management - Index
 * Redux-style state management built on Pulsar signals
 */

// Core store
export {
  createStore,
  type IStore,
  type IStoreAction,
  type IStoreMiddleware,
  type IStoreOptions,
  type IStoreReducer,
} from './store';

// Undo/Redo
export {
  canRedo,
  canUndo,
  createUndoMiddleware,
  getHistoryMetadata,
  undoable,
  UndoRedoActions,
  type IHistoryState,
  type IUndoOptions,
} from './undo-redo';

// Persistence
export {
  createPersistentStore,
  createPersistMiddleware,
  createSessionStore,
  restoreState,
  type IPersistOptions,
} from './persistence';
