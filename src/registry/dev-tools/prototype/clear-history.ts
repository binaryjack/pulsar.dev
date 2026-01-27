/**
 * Clear performance history
 */

import type { IPerformanceMeasurement, IPerformanceMonitor } from '../performance-monitor.types';

/**
 * Internal history storage
 */
interface IMonitorWithHistory extends IPerformanceMonitor {
  _history: IPerformanceMeasurement[];
}

/**
 * Clear all performance history
 */
export const clearHistory = function (this: IPerformanceMonitor): void {
  const monitor = this as IMonitorWithHistory;
  monitor._history.length = 0;
};
