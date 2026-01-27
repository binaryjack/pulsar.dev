/**
 * Get performance history with optional filtering
 */

import type {
  IHistoryQuery,
  IPerformanceMeasurement,
  IPerformanceMonitor,
} from '../performance-monitor.types';

/**
 * Internal history storage
 */
interface IMonitorWithHistory extends IPerformanceMonitor {
  _history: IPerformanceMeasurement[];
}

/**
 * Get raw performance history with optional filtering
 */
export const getHistory = function (
  this: IPerformanceMonitor,
  query?: IHistoryQuery
): IPerformanceMeasurement[] {
  const monitor = this as IMonitorWithHistory;
  let results = monitor._history.slice();

  // Apply filters
  if (query) {
    if (query.operation) {
      results = results.filter((m) => m.operation === query.operation);
    }

    if (query.since !== undefined) {
      results = results.filter((m) => m.timestamp >= query.since!);
    }

    if (query.until !== undefined) {
      results = results.filter((m) => m.timestamp <= query.until!);
    }

    if (query.limit !== undefined && query.limit > 0) {
      results = results.slice(-query.limit);
    }
  }

  return results;
};
