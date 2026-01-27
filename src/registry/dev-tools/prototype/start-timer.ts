/**
 * Start performance timer
 */

import type { IPerformanceMonitor, OperationType } from '../performance-monitor.types';

/**
 * Start timing an operation (convenience method)
 * Returns callback to end timer
 */
export const startTimer = function (
  this: IPerformanceMonitor,
  operation: OperationType,
  elementId?: string,
  metadata?: Record<string, unknown>
): () => void {
  const startTime = performance.now();
  const timestamp = Date.now();

  return () => {
    const duration = performance.now() - startTime;
    this.trackOperation({
      operation,
      duration,
      timestamp,
      elementId,
      metadata,
    });
  };
};
