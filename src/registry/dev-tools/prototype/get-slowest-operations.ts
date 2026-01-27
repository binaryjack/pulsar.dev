/**
 * Get slowest operations
 */

import type { IPerformanceMeasurement, IPerformanceMonitor } from '../performance-monitor.types';

/**
 * Internal history storage
 */
interface IMonitorWithHistory extends IPerformanceMonitor {
  _history: IPerformanceMeasurement[];
}

/**
 * Get slowest operations from history
 */
export const getSlowestOperations = function (
  this: IPerformanceMonitor,
  limit: number = 10
): IPerformanceMeasurement[] {
  const monitor = this as IMonitorWithHistory;

  // Sort by duration descending
  return monitor._history
    .slice()
    .sort((a, b) => b.duration - a.duration)
    .slice(0, limit);
};
