// ========================================
// NEW REGISTRY PATTERN ARCHITECTURE
// ========================================

// Global registry and watcher
export { $REGISTRY, $WATCHER, CoreRegistry, NodeWatcher } from './registry';
export type {
  IComponentContext,
  ICoreRegistry,
  IEffectOwner,
  INodeWatcher,
  WireDisposer,
  WireSet,
} from './registry';

// SSR-aware element creation
export { t_element } from './jsx-runtime/t-element';
export type { IElementAttributes } from './jsx-runtime/t-element';

// Reset signal ID counter for SSR
export { resetSignalIdCounter } from './reactivity/signal/signal';

// ========================================
// CORE REACTIVITY (Updated for Registry)
// ========================================

// Export reactivity with specific exports to avoid ambiguity
export {
  Effect,
  Memo,
  SEffect,
  SMemo,
  SSignal,
  Signal,
  batch,
  createEffect,
  createEffectWithOwner,
  createMemo,
  createSignal,
  isBatching,
  useSync,
} from './reactivity';
export type {
  BatchFn,
  IEffect,
  IMemo,
  ISignal,
  ISignalOptions,
  ISignalSubscriber,
  SnapshotFunction,
  SubscribeFunction,
} from './reactivity';

// Export resource system
export {
  Waiting,
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
  Tryer,
  cleanupTryer,
  createErrorBoundaryContext,
  getActiveErrorBoundary,
  resetTryer,
  setActiveErrorBoundary,
  updateCatcher,
} from './error-boundary';
export type {
  ICatcherProps,
  IErrorBoundaryContext,
  IErrorBoundaryOptions,
  IErrorInfo,
  ITryerProps,
} from './error-boundary';

// Export control flow (registry-based only)
export { ForRegistry, Index, ShowRegistry } from './control-flow';
export type { IIndexProps } from './control-flow';

// Export portal
export { Portal, PortalSlot, cleanupPortals } from './portal';
export type { IPortalProps, IPortalSlotProps } from './portal';

// Export dev utilities
export { DEV, invariant, warn } from './dev';
export type { IDevError, IDevWarning } from './dev';

// Export environment utilities
export { env, getMode, isDev, isProd, isSSR, isTest } from './env';
export type { PulsarEnv } from './env';

// Export environment validation schema
export {
  createEnvSchema,
  boolean as envBoolean,
  number as envNumber,
  oneOf as envOneOf,
  optional as envOptional,
  required as envRequired,
  string as envString,
} from './env';
export type {
  IEnvRule,
  IEnvSchema,
  IEnvValidationError,
  INumberRuleOptions,
  IStringRuleOptions,
} from './env';

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
  SServiceManager,
  ServiceFactoryType,
  ServiceIdType,
  ServiceLifetimeType,
} from './di';

// Export bootstrap (explicit to avoid conflicts with lifecycle)
export { bootstrapApp, disposePulsar, initPulsar } from './bootstrap';
export type { IApplicationBuilder, IApplicationRoot, IBootstrapConfig } from './bootstrap';

// Export type utilities
export type { Children, HtmlExtends, Pulsar } from './types/html-extends';

// Export JSX runtime
export * from './jsx-runtime';

// Export context
export { createContext, useContext } from './context';
export type { IContext } from './context';

// Export app context provider separately to avoid circular dependencies
export { AppContext, AppContextProvider, useAppContext } from './context/app-context-provider';
export type { IAppContext, IAppContextProviderProps } from './context/app-context-provider';

// Export router
export * from './router';

// Export state management
export * from './state';

// Export HTTP client
export { HttpClient, createHttpClient, useHttp, useHttpGet, useHttpPost } from './http';
export type {
  ErrorInterceptor,
  ICacheEntry,
  IHttpClient,
  IHttpClientConfig,
  IHttpError,
  IHttpRequestConfig,
  IHttpResponse,
  IRetryConfig,
  IUseHttpResult,
  IUseHttpState,
  RequestInterceptor,
  ResponseInterceptor,
} from './http';

// Export SSR
export {
  createHydrationScript,
  createSSRContext,
  deserializeData,
  escapeAttribute,
  escapeHtml,
  extractHydrationState,
  generateStatic,
  hydrate,
  renderToString,
  serializeData,
} from './ssr';
export type {
  ComponentFunction,
  IHydrateOptions,
  IRenderResult,
  IRenderToStringOptions,
  ISSRContext,
  IStaticGenerationOptions,
} from './ssr';

// Export formular.dev integration
export { useFormular } from './formular';
export type {
  AsyncValidatorMap,
  CustomValidatorMap,
  ErrorHandler,
  FormularFields,
  IFormularContext,
  IFormularField,
  IFormularFieldArray,
  IFormularHook,
  IFormularOptions,
  IFormularState,
  SubmitHandler,
  SuccessHandler,
  ValidatorFn,
  ValidatorMap,
} from './formular';

// Export utilities
export { produce } from './utilities';

// ⚠️ Imperative Handle - ESCAPE HATCH for browser APIs ONLY
// See packages/pulsar.dev/src/utilities/imperative-handle/README.md for valid use cases
// Requires code review approval - use declarative props for 99% of components
export { createImperativeHandle } from './utilities';
export type {
  IImperativeHandle,
  IImperativeHandleConfig,
  IImperativeHandleMetadata,
  ImperativeHandleUseCase,
} from './utilities';

// Export testing utilities
export {
  act,
  blur,
  blurField,
  change,
  cleanup,
  click,
  createMockForm,
  createQueries,
  createSpy,
  // formular.dev
  fillField,
  fillForm,
  // Events
  fireEvent,
  flush,
  focus,
  getFieldError,
  getFormErrors,
  isFieldDirty,
  isFieldTouched,
  isFieldValid,
  isFormSubmitting,
  isFormValid,
  keyboard,
  mockContext,
  mockFetch,
  mockLocalStorage,
  // Mocks
  mockRouter,
  mockService,
  nextTick,
  // Rendering
  render,
  restoreAllMocks,
  // Queries
  screen,
  setupAutoCleanup,
  submit,
  submitForm,
  type,
  wait,
  // Async
  waitFor,
  waitForElement,
  waitForElementToBeRemoved,
  waitForFieldValidation,
  waitForFormSubmission,
  waitForStateUpdate,
} from './testing';

export type {
  IAccessibilityQueries,
  IFireEventOptions,
  IMockFormOptions,
  IMockRouterOptions,
  IMockService,
  IQueryOptions,
  IRenderOptions,
  IRenderResult as ITestingRenderResult,
  IWaitForOptions,
  TCleanupFunction,
} from './testing';

// Utility functions
export { shallowEqual } from './utils';

// Lazy loading utilities (separate import path: 'pulsar/lazy-loading')
// export * from './lazy-loading';

// Build tools (separate import path: 'pulsar/build-tools')
// export * from './build-tools';
