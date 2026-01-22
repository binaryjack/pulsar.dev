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
export function preloadOnHover(element: HTMLElement, lazyComponent: ILazyComponent): () => void {
  function handleHover() {
    lazyComponent.preload();
  }

  element.addEventListener('mouseenter', handleHover, { once: true });
  element.addEventListener('focus', handleHover, { once: true });

  return () => {
    element.removeEventListener('mouseenter', handleHover);
    element.removeEventListener('focus', handleHover);
  };
}

/**
 * Preload component when visible (Intersection Observer)
 */
export function preloadOnVisible(
  element: HTMLElement,
  lazyComponent: ILazyComponent,
  options?: IntersectionObserverInit
): () => void {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          lazyComponent.preload();
          observer.disconnect();
        }
      });
    },
    options || { threshold: 0.1 }
  );

  observer.observe(element);

  return () => {
    observer.disconnect();
  };
}

/**
 * Preload component immediately (eager)
 */
export function preloadEager(lazyComponent: ILazyComponent): void {
  lazyComponent.preload();
}

/**
 * Preload component when browser is idle
 */
export function preloadOnIdle(lazyComponent: ILazyComponent): () => void {
  let idleId: number | null = null;

  if ('requestIdleCallback' in window) {
    idleId = (window as any).requestIdleCallback(() => {
      lazyComponent.preload();
    });
  } else {
    // Fallback for browsers without requestIdleCallback
    const timeoutId = setTimeout(() => {
      lazyComponent.preload();
    }, 100);
    return () => clearTimeout(timeoutId);
  }

  return () => {
    if (idleId !== null && 'cancelIdleCallback' in window) {
      (window as any).cancelIdleCallback(idleId);
    }
  };
}

/**
 * Apply preload strategy to element
 */
export function applyPreloadStrategy(
  element: HTMLElement,
  lazyComponent: ILazyComponent,
  strategy: PreloadStrategy
): () => void {
  switch (strategy) {
    case 'hover':
      return preloadOnHover(element, lazyComponent);

    case 'visible':
      return preloadOnVisible(element, lazyComponent);

    case 'eager':
      preloadEager(lazyComponent);
      return () => {};

    case 'idle':
      return preloadOnIdle(lazyComponent);

    case 'none':
    default:
      return () => {};
  }
}

/**
 * Batch preload multiple components
 */
export function batchPreload(lazyComponents: ILazyComponent[]): Promise<any[]> {
  return Promise.all(lazyComponents.map((comp) => comp.preload()));
}

/**
 * Preload with timeout
 */
export function preloadWithTimeout(lazyComponent: ILazyComponent, timeoutMs: number): Promise<any> {
  return Promise.race([
    lazyComponent.preload(),
    new Promise((_, reject) => setTimeout(() => reject(new Error('Preload timeout')), timeoutMs)),
  ]);
}
