/**
 * @fileoverview Factory function for creating lazy components
 * @module @pulsar/lazy-loading
 */
import type { IComponentLoader, ILazyComponent } from './lazy-loading.types';
/**
 * Create a lazy-loaded component that loads on demand
 *
 * @example
 * ```tsx
 * const LazyChart = lazy(() => import('./Chart'));
 *
 * // Preload without rendering
 * LazyChart.preload();
 *
 * // Render with Waiting fallback
 * <Waiting default={<Spinner />}>
 *   <LazyChart data={chartData} />
 * </Waiting>
 * ```
 */
export declare function lazy<T extends object = any>(loader: IComponentLoader<T>): ILazyComponent<T>;
