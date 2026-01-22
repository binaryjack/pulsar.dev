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
  UndoRedoActions,
  canRedo,
  canUndo,
  createUndoMiddleware,
  getHistoryMetadata,
  undoable,
  type IHistoryState,
  type IUndoOptions,
} from './undo-redo';

// Persistence
export {
  createPersistMiddleware,
  createPersistentStore,
  createSessionStore,
  restoreState,
  type IPersistOptions,
} from './persistence';

// Reconcile - Efficient immutable updates
export {
  diffArrays,
  diffObjects,
  isPlainObject,
  reconcile,
  reconcileWith,
  type IReconcileOptions,
  type PlainObject,
  type ReconcileResult,
} from './reconcile';
