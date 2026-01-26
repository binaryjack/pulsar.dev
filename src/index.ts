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
export { For, Index, Show } from './control-flow';
export type { IForProps, IIndexProps, IShowProps } from './control-flow';

// Export portal
export { cleanupPortals, Portal, PortalSlot } from './portal';
export type { IPortalProps, IPortalSlotProps } from './portal';

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
export { createHttpClient, HttpClient, useHttp, useHttpGet, useHttpPost } from './http';
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

// Lazy loading utilities (separate import path: 'pulsar/lazy-loading')
// export * from './lazy-loading';

// Build tools (separate import path: 'pulsar/build-tools')
// export * from './build-tools';
