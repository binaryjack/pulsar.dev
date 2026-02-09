/// <reference types="vite/client" />

// Auto-include PSR file type declarations
/// <reference path="./types/psr-modules.d.ts" />

export { bootstrapApp, pulse } from './bootstrap';
export type {
  IApplicationBuilder,
  IApplicationRoot,
  IBootstrapConfig,
  IPulseConfig,
} from './bootstrap';
export { createContext, useContext } from './context';
export type { IContext } from './context';
export { AppContext, AppContextProvider, useAppContext } from './context/app-context-provider';
export type { IAppContext, IAppContextProviderProps } from './context/app-context-provider';
export { For, Index, Show } from './control-flow';
export type { IForProps, IIndexProps, IShowProps } from './control-flow';
export { DEV, invariant, warn } from './dev';
export type { IDevError, IDevWarning } from './dev';
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
export * from './events';
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
export * from './hooks';
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
export * from './jsx-runtime';
export * from './lifecycle';
export { cleanupPortals, Portal, PortalSlot } from './portal';
export type { IPortalProps, IPortalSlotProps } from './portal';
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
export * from './router';
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
export * from './state';
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
  fillField,
  fillForm,
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
  mockRouter,
  mockService,
  nextTick,
  render,
  restoreAllMocks,
  screen,
  setupAutoCleanup,
  submit,
  submitForm,
  type,
  wait,
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
export type { Children, HtmlExtends, Pulsar } from './types/html-extends';
export { produce } from './utilities';
