/**
 * @fileoverview Lazy component wrapper with built-in loading state
 * @module @pulsar/lazy-loading
 */
import type { ILazyComponentProps } from './lazy-loading.types';
/**
 * Component wrapper that handles lazy loading with fallback
 *
 * @example
 * ```tsx
 * <LazyComponent
 *   loader={() => import('./Chart')}
 *   props={{ data: chartData }}
 *   fallback={<Spinner />}
 * />
 * ```
 */
export declare function LazyComponent(componentProps: ILazyComponentProps): HTMLElement;
