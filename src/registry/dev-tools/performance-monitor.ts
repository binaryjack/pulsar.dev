/**
 * Performance Monitor
 * Tracks and analyzes registry operation performance
 */

import type { IApplicationRoot } from '../../bootstrap/application-root.interface';
import type { IPerformanceMonitor } from './performance-monitor.types';

// Import prototype methods
import { clearHistory } from './prototype/clear-history';
import { getAllMetrics } from './prototype/get-all-metrics';
import { getHistory } from './prototype/get-history';
import { getMemoryMetrics } from './prototype/get-memory-metrics';
import { getMetrics } from './prototype/get-metrics';
import { getSlowestOperations } from './prototype/get-slowest-operations';
import { startTimer } from './prototype/start-timer';
import { trackOperation } from './prototype/track-operation';

/**
 * PerformanceMonitor constructor function (prototype-based)
 * Provides performance tracking and analysis for registry operations
 */
export const PerformanceMonitor = function (this: IPerformanceMonitor, appRoot: IApplicationRoot) {
  // Store ApplicationRoot reference
  Object.defineProperty(this, 'appRoot', {
    value: appRoot,
    writable: false,
    enumerable: true,
  });

  // Initialize private history storage
  Object.defineProperty(this, '_history', {
    value: [],
    writable: true,
    enumerable: false,
  });

  // Default max history size (10,000 measurements)
  this.maxHistorySize = 10000;
} as unknown as { new (appRoot: IApplicationRoot): IPerformanceMonitor };

// Attach prototype methods
PerformanceMonitor.prototype.trackOperation = trackOperation;
PerformanceMonitor.prototype.getMetrics = getMetrics;
PerformanceMonitor.prototype.getAllMetrics = getAllMetrics;
PerformanceMonitor.prototype.getHistory = getHistory;
PerformanceMonitor.prototype.getMemoryMetrics = getMemoryMetrics;
PerformanceMonitor.prototype.clearHistory = clearHistory;
PerformanceMonitor.prototype.getSlowestOperations = getSlowestOperations;
PerformanceMonitor.prototype.startTimer = startTimer;

// Type-only exports
export type {
  IHistoryQuery,
  IMemoryMetrics,
  IPerformanceMeasurement,
  IPerformanceMetrics,
  IPerformanceMonitor,
  OperationType,
} from './performance-monitor.types';
