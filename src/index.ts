// Export reactivity with specific exports to avoid ambiguity
export {
  batch,
  createEffect,
  createMemo,
  createSignal,
  Effect,
  isBatching,
  Memo,
  SEffect,
  Signal,
  SMemo,
  SSignal,
} from './reactivity';
export type {
  BatchFn,
  IEffect,
  IMemo,
  ISignal,
  ISignalOptions,
  ISignalSubscriber,
} from './reactivity';

// Export resource system
export {
  clearAll,
  createResource,
  createTrackedResource,
  getErrors,
  isAllSuccess,
  isAnyError,
  isAnyLoading,
  refetchAll,
  resolveWaiting,
  suspendWaiting,
  waitForAll,
  Waiting,
} from './resource';
export type {
  IResource,
  IResourceOptions,
  IWaitingProps,
  ResourceFetcher,
  ResourceState,
} from './resource';

// Export error boundary system
export {
  Catcher,
  cleanupTryer,
  createErrorBoundaryContext,
  getActiveErrorBoundary,
  resetTryer,
  setActiveErrorBoundary,
  Tryer,
  updateCatcher,
} from './error-boundary';
export type {
  ICatcherProps,
  IErrorBoundaryContext,
  IErrorBoundaryOptions,
  IErrorInfo,
  ITryerProps,
} from './error-boundary';

// Export control flow
export { For, Show } from './control-flow';
export type { IForProps, IShowProps } from './control-flow';

// Export portal
export { cleanupPortals, Portal } from './portal';
export type { IPortalProps } from './portal';

// Export dev utilities
export { DEV, invariant, warn } from './dev';
export type { IDevError, IDevWarning } from './dev';

// Export events
export * from './events';

// Export hooks
export * from './hooks';

// Export lifecycle
export * from './lifecycle';

// Export dependency injection
export { ServiceLocator, ServiceManager } from './di';
export type {
  IDisposableService,
  IServiceDescriptor,
  IServiceLocator,
  IServiceManager,
  IServiceOptions,
  ServiceFactoryType,
  ServiceIdType,
  ServiceLifetimeType,
  SServiceManager,
} from './di';

// Export bootstrap (explicit to avoid conflicts with lifecycle)
export { bootstrapApp } from './bootstrap';
export type { IApplicationBuilder, IApplicationRoot, IBootstrapConfig } from './bootstrap';

// Export type utilities
export type { HtmlExtends, Pulsar } from './types/html-extends';

// Export JSX runtime
export * from './jsx-runtime';

// Export context
export * from './context';

// Export router
export * from './router';

// Export state management
export * from './state';

// Testing utilities (separate import path: 'pulsar/testing')
// export * from './testing';

// Lazy loading utilities (separate import path: 'pulsar/lazy-loading')
// export * from './lazy-loading';

// Build tools (separate import path: 'pulsar/build-tools')
// export * from './build-tools';
