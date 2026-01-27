/**
 * Get all operation metrics
 */

import type {
  IPerformanceMetrics,
  IPerformanceMonitor,
  OperationType,
} from '../performance-monitor.types';

/**
 * Get metrics for all operation types
 */
export const getAllMetrics = function (
  this: IPerformanceMonitor
): Map<OperationType, IPerformanceMetrics> {
  const operations: OperationType[] = [
    'register',
    'unregister',
    'lookup',
    'render',
    'event-dispatch',
    'cleanup',
  ];

  const metricsMap = new Map<OperationType, IPerformanceMetrics>();

  for (const operation of operations) {
    const metrics = this.getMetrics(operation);
    if (metrics) {
      metricsMap.set(operation, metrics);
    }
  }

  return metricsMap;
};
