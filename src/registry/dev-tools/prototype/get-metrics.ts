/**
 * Get aggregated metrics for operation type
 */

import type {
  IPerformanceMeasurement,
  IPerformanceMetrics,
  IPerformanceMonitor,
  OperationType,
} from '../performance-monitor.types';

/**
 * Internal history storage
 */
interface IMonitorWithHistory extends IPerformanceMonitor {
  _history: IPerformanceMeasurement[];
}

/**
 * Get aggregated metrics for specific operation type
 */
export const getMetrics = function (
  this: IPerformanceMonitor,
  operation: OperationType
): IPerformanceMetrics | null {
  const monitor = this as IMonitorWithHistory;
  const measurements = monitor._history.filter((m) => m.operation === operation);

  if (measurements.length === 0) {
    return null;
  }

  // Sort by duration for percentile calculation
  const sorted = measurements.slice().sort((a, b) => a.duration - b.duration);
  const count = sorted.length;

  // Calculate aggregates
  const totalDuration = sorted.reduce((sum, m) => sum + m.duration, 0);
  const avgDuration = totalDuration / count;
  const minDuration = sorted[0].duration;
  const maxDuration = sorted[count - 1].duration;

  // Calculate percentiles
  const p95Index = Math.floor(count * 0.95);
  const p99Index = Math.floor(count * 0.99);
  const p95Duration = sorted[Math.min(p95Index, count - 1)].duration;
  const p99Duration = sorted[Math.min(p99Index, count - 1)].duration;

  return {
    operation,
    count,
    avgDuration,
    minDuration,
    maxDuration,
    totalDuration,
    p95Duration,
    p99Duration,
  };
};
