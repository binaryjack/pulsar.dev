/**
 * @fileoverview Preload strategies for lazy components
 * @module @pulsar/lazy-loading
 */
import type { ILazyComponent } from './lazy-loading.types';
/**
 * Preload strategy type
 */
export type PreloadStrategy = 'hover' | 'visible' | 'eager' | 'idle' | 'none';
/**
 * Preload component on hover
 */
export declare function preloadOnHover(element: HTMLElement, lazyComponent: ILazyComponent): () => void;
/**
 * Preload component when visible (Intersection Observer)
 */
export declare function preloadOnVisible(element: HTMLElement, lazyComponent: ILazyComponent, options?: IntersectionObserverInit): () => void;
/**
 * Preload component immediately (eager)
 */
export declare function preloadEager(lazyComponent: ILazyComponent): void;
/**
 * Preload component when browser is idle
 */
export declare function preloadOnIdle(lazyComponent: ILazyComponent): () => void;
/**
 * Apply preload strategy to element
 */
export declare function applyPreloadStrategy(element: HTMLElement, lazyComponent: ILazyComponent, strategy: PreloadStrategy): () => void;
/**
 * Batch preload multiple components
 */
export declare function batchPreload(lazyComponents: ILazyComponent[]): Promise<any[]>;
/**
 * Preload with timeout
 */
export declare function preloadWithTimeout(lazyComponent: ILazyComponent, timeoutMs: number): Promise<any>;
