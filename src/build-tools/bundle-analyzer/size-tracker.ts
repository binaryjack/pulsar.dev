/**
 * @fileoverview Size tracking and historical comparison
 * @module @pulsar/build-tools/bundle-analyzer
 */

import type { IBundleAnalysis, ISizeComparison } from './bundle-analyzer.types';

/**
 * Size history entry
 */
interface ISizeHistory {
  timestamp: number;
  totalSize: number;
  gzippedSize: number;
  chunkCount: number;
  moduleCount: number;
}

/**
 * Size tracker interface
 */
export interface ISizeTracker {
  record(analysis: IBundleAnalysis): void;
  compareWithPrevious(current: IBundleAnalysis): ISizeComparison | null;
  compare(previous: number, current: number): ISizeComparison;
  getTrend(days?: number): ISizeHistory[];
  getAverage(days?: number): number;
  getMaxSize(): number;
  getMinSize(): number;
  detectSpike(threshold?: number): boolean;
  exportHistory(): string;
  importHistory(json: string): void;
  clear(): void;
  getHistory(): ISizeHistory[];
}

/**
 * Internal size tracker interface
 */
export interface ISizeTrackerInternal extends ISizeTracker {
  history: ISizeHistory[];
  maxHistorySize: number;
}

/**
 * Size tracker for monitoring bundle growth
 */
export const SizeTracker = function (this: ISizeTrackerInternal) {
  Object.defineProperty(this, 'history', {
    value: [] as ISizeHistory[],
    writable: true,
    enumerable: false,
    configurable: false,
  });

  Object.defineProperty(this, 'maxHistorySize', {
    value: 100,
    writable: true,
    enumerable: false,
    configurable: false,
  });
} as unknown as { new (): ISizeTrackerInternal };

/**
 * Record current bundle analysis
 */
SizeTracker.prototype.record = function (
  this: ISizeTrackerInternal,
  analysis: IBundleAnalysis
): void {
  this.history.push({
    timestamp: analysis.timestamp,
    totalSize: analysis.totalSize,
    gzippedSize: analysis.gzippedSize,
    chunkCount: analysis.chunkCount,
    moduleCount: analysis.moduleCount,
  });

  // Trim history if too large
  if (this.history.length > this.maxHistorySize) {
    this.history.shift();
  }
};

/**
 * Compare current with previous build
 */
SizeTracker.prototype.compareWithPrevious = function (
  this: ISizeTrackerInternal,
  current: IBundleAnalysis
): ISizeComparison | null {
  if (this.history.length === 0) {
    return null;
  }

  const previous = this.history[this.history.length - 1];
  return this.compare(previous.totalSize, current.totalSize);
};

/**
 * Compare two sizes
 */
SizeTracker.prototype.compare = function (
  this: ISizeTrackerInternal,
  previous: number,
  current: number
): ISizeComparison {
  const difference = current - previous;
  const percentChange = previous > 0 ? (difference / previous) * 100 : 0;

  return {
    current,
    previous,
    difference,
    percentChange,
    increased: difference > 0,
  };
};

/**
 * Get size trend over time
 */
SizeTracker.prototype.getTrend = function (
  this: ISizeTrackerInternal,
  days: number = 7
): ISizeHistory[] {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return this.history.filter((entry) => entry.timestamp >= cutoff);
};

/**
 * Calculate average size over period
 */
SizeTracker.prototype.getAverage = function (this: ISizeTrackerInternal, days: number = 7): number {
  const trend = this.getTrend(days);
  if (trend.length === 0) return 0;

  const sum = trend.reduce((acc, entry) => acc + entry.totalSize, 0);
  return sum / trend.length;
};

/**
 * Get maximum size in history
 */
SizeTracker.prototype.getMaxSize = function (this: ISizeTrackerInternal): number {
  if (this.history.length === 0) return 0;
  return Math.max(...this.history.map((e) => e.totalSize));
};

/**
 * Get minimum size in history
 */
SizeTracker.prototype.getMinSize = function (this: ISizeTrackerInternal): number {
  if (this.history.length === 0) return 0;
  return Math.min(...this.history.map((e) => e.totalSize));
};

/**
 * Detect size spike (sudden increase)
 */
SizeTracker.prototype.detectSpike = function (
  this: ISizeTrackerInternal,
  threshold: number = 0.2
): boolean {
  if (this.history.length < 2) return false;

  const current = this.history[this.history.length - 1];
  const previous = this.history[this.history.length - 2];

  const increase = (current.totalSize - previous.totalSize) / previous.totalSize;
  return increase > threshold;
};

/**
 * Export history as JSON
 */
SizeTracker.prototype.exportHistory = function (this: ISizeTrackerInternal): string {
  return JSON.stringify(this.history, null, 2);
};

/**
 * Import history from JSON
 */
SizeTracker.prototype.importHistory = function (this: ISizeTrackerInternal, json: string): void {
  try {
    this.history = JSON.parse(json);
  } catch (error) {
    console.error('Failed to import size history:', error);
  }
};

/**
 * Clear history
 */
SizeTracker.prototype.clear = function (this: ISizeTrackerInternal): void {
  this.history = [];
};

/**
 * Get full history
 */
SizeTracker.prototype.getHistory = function (this: ISizeTrackerInternal): ISizeHistory[] {
  return [...this.history];
};

/**
 * Check if size is within threshold
 */
export function checkSizeThreshold(
  size: number,
  thresholds: { warning: number; error: number; critical: number }
): 'ok' | 'warning' | 'error' | 'critical' {
  if (size >= thresholds.critical) return 'critical';
  if (size >= thresholds.error) return 'error';
  if (size >= thresholds.warning) return 'warning';
  return 'ok';
}

/**
 * Calculate size budget remaining
 */
export function calculateBudgetRemaining(
  current: number,
  budget: number
): {
  remaining: number;
  percentUsed: number;
  exceeded: boolean;
} {
  const remaining = budget - current;
  const percentUsed = (current / budget) * 100;

  return {
    remaining,
    percentUsed,
    exceeded: remaining < 0,
  };
}
