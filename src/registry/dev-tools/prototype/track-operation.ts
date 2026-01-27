/**
 * Track performance measurement
 */

import type { IPerformanceMeasurement, IPerformanceMonitor } from '../performance-monitor.types';

/**
 * Internal history storage
 */
interface IMonitorWithHistory extends IPerformanceMonitor {
  _history: IPerformanceMeasurement[];
}

/**
 * Track a performance measurement
 */
export const trackOperation = function (
  this: IPerformanceMonitor,
  measurement: IPerformanceMeasurement
): void {
  const monitor = this as IMonitorWithHistory;

  // Add to history
  monitor._history.push(measurement);

  // Trim if exceeds max size (remove oldest 20%)
  if (monitor._history.length > this.maxHistorySize) {
    const removeCount = Math.floor(this.maxHistorySize * 0.2);
    monitor._history.splice(0, removeCount);
  }
};
