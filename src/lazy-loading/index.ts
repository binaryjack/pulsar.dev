/**
 * @fileoverview Lazy loading utilities for code splitting
 * @module @pulsar/lazy-loading
 *
 * @example
 * ```tsx
 * import { lazy, Waiting } from '@pulsar-framework/pulsar.dev/lazy-loading';
 *
 * const Chart = lazy(() => import('./Chart'));
 *
 * function App() {
 *   return (
 *     <Waiting default={<Spinner />}>
 *       <Chart data={data} />
 *     </Waiting>
 *   );
 * }
 * ```
 */

export { lazy } from './create-lazy';
export { LazyComponent } from './lazy-component-wrapper';
export {
  applyPreloadStrategy,
  batchPreload,
  preloadEager,
  preloadOnHover,
  preloadOnIdle,
  preloadOnVisible,
  preloadWithTimeout,
  type PreloadStrategy,
} from './preload-strategies';

// Re-export Waiting from resource system (use this for lazy loading boundaries)
export { Waiting, resolveWaiting, suspendWaiting } from '../resource/waiting';
export type { IWaitingProps } from '../resource/waiting.types';

export type {
  IComponentLoader,
  ILazyComponent,
  ILazyComponentProps,
  ILazyOptions,
  ILazyRoute,
  ILazyState,
} from './lazy-loading.types';
