/**
 * @fileoverview Type definitions for lazy route loading
 * @module @pulsar/router/lazy
 */

import type { ILazyComponent } from '../../lazy-loading/lazy-loading.types';
import type { IRoute } from '../route.interface';

/**
 * Lazy route with component loader
 */
export interface ILazyRoute<P = Record<string, unknown>> extends Omit<
  IRoute,
  'component' | 'element'
> {
  /** Lazy component loader */
  component: ILazyComponent<(props: P) => HTMLElement>;

  /** Preload strategy for this route */
  preload?: 'hover' | 'visible' | 'eager' | 'idle' | 'none';

  /** Fallback to show while loading */
  fallback?: () => HTMLElement;

  /** Error boundary for loading failures */
  errorBoundary?: (error: Error) => HTMLElement;
}

/**
 * Route manifest for build optimization
 */
export interface IRouteManifest {
  /** Route path */
  path: string;

  /** Chunk name/ID */
  chunkName: string;

  /** Estimated chunk size (bytes) */
  estimatedSize?: number;

  /** Dependencies (other chunks this depends on) */
  dependencies?: string[];

  /** Whether this route is preloaded */
  preload: boolean;

  /** Preload strategy */
  preloadStrategy?: 'hover' | 'visible' | 'eager' | 'idle' | 'none';
}

/**
 * Route prefetch options
 */
export interface IRoutePrefetchOptions {
  /** Routes to prefetch */
  routes: string[];

  /** Prefetch strategy */
  strategy?: 'hover' | 'visible' | 'eager' | 'idle';

  /** Timeout for prefetch (ms) */
  timeout?: number;

  /** Only prefetch if user is on fast connection */
  fastConnectionOnly?: boolean;
}

/**
 * Route loader cache entry
 */
export interface IRouteLoaderCache {
  /** Route path */
  path: string;

  /** Loaded component */
  component: ((props: Record<string, unknown>) => HTMLElement) | null;

  /** Loading promise */
  promise: Promise<(props: Record<string, unknown>) => HTMLElement> | null;

  /** Loading status */
  status: 'idle' | 'loading' | 'success' | 'error';

  /** Error if loading failed */
  error: Error | null;

  /** Timestamp of last load */
  loadedAt: number;
}
