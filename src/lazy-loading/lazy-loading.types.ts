/**
 * @fileoverview Type definitions for lazy loading system
 * @module @pulsar/lazy-loading/types
 */

/**
 * Component loader function that returns a promise
 */
export type IComponentLoader<T = any> = () => Promise<{ default: T } | T>;

/**
 * Lazy component wrapper with loading state
 */
export interface ILazyComponent<T = any> {
  /** Original component loader */
  readonly loader: IComponentLoader<T>;

  /** Preload the component without rendering */
  preload(): Promise<T>;

  /** Current loading state */
  readonly state: ILazyState<T>;

  /** Component type marker */
  readonly __lazy: true;
}

/**
 * Loading state for lazy components
 */
export interface ILazyState<T = any> {
  /** Loading status */
  status: 'idle' | 'loading' | 'success' | 'error';

  /** Loaded component */
  component: T | null;

  /** Error if loading failed */
  error: Error | null;

  /** Loading promise */
  promise: Promise<T> | null;
}

/**
 * Options for lazy loading
 */
export interface ILazyOptions {
  /** Delay before showing loading state (ms) */
  delay?: number;

  /** Timeout for loading (ms) */
  timeout?: number;

  /** Fallback component while loading */
  fallback?: any;

  /** Error boundary component */
  errorBoundary?: any;

  /** Enable preloading on hover/interaction */
  preload?: boolean;
}

/**
 * Lazy component props
 */
export interface ILazyComponentProps {
  /** Component loader */
  loader: IComponentLoader;

  /** Props to pass to loaded component */
  props?: Record<string, any>;

  /** Loading component */
  fallback?: any;

  /** Error component */
  errorBoundary?: any;
}

/**
 * Route lazy loading config
 */
export interface ILazyRoute {
  /** Route path */
  path: string;

  /** Component loader */
  component: IComponentLoader;

  /** Preload strategy */
  preload?: 'hover' | 'visible' | 'eager' | 'none';

  /** Loading component */
  fallback?: any;
}
