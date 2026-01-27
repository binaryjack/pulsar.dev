/**
 * Get memory usage metrics
 */

import type { IMemoryMetrics, IPerformanceMonitor } from '../performance-monitor.types';

/**
 * Average bytes per element metadata (estimated)
 */
const BYTES_PER_ELEMENT = 200;

/**
 * Average bytes per event handler entry (estimated)
 */
const BYTES_PER_HANDLER = 150;

/**
 * Get memory usage estimates
 */
export const getMemoryMetrics = function (this: IPerformanceMonitor): IMemoryMetrics {
  const registry = this.appRoot.registry;
  const delegator = this.appRoot.eventDelegator;

  // Count elements using size() method
  const elementCount = registry.size();

  // Count handlers
  let handlerCount = 0;
  for (const elementHandlers of delegator.handlers.values()) {
    handlerCount += elementHandlers.size;
  }

  // Estimate memory usage (rough approximation)
  const estimatedMetadataSize = elementCount * BYTES_PER_ELEMENT;
  const estimatedHandlerMapSize = handlerCount * BYTES_PER_HANDLER;
  const totalEstimatedSize = estimatedMetadataSize + estimatedHandlerMapSize;

  return {
    elementCount,
    handlerCount,
    estimatedMetadataSize,
    estimatedHandlerMapSize,
    totalEstimatedSize,
  };
};
