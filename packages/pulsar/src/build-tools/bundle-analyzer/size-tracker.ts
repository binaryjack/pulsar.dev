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
 * Size tracker for monitoring bundle growth
 */
export class SizeTracker {
  private history: ISizeHistory[] = [];
  private maxHistorySize: number = 100;

  /**
   * Record current bundle analysis
   */
  record(analysis: IBundleAnalysis): void {
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
  }

  /**
   * Compare current with previous build
   */
  compareWithPrevious(current: IBundleAnalysis): ISizeComparison | null {
    if (this.history.length === 0) {
      return null;
    }

    const previous = this.history[this.history.length - 1];
    return this.compare(previous.totalSize, current.totalSize);
  }

  /**
   * Compare two sizes
   */
  compare(previous: number, current: number): ISizeComparison {
    const difference = current - previous;
    const percentChange = previous > 0 ? (difference / previous) * 100 : 0;

    return {
      current,
      previous,
      difference,
      percentChange,
      increased: difference > 0,
    };
  }

  /**
   * Get size trend over time
   */
  getTrend(days: number = 7): ISizeHistory[] {
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    return this.history.filter((entry) => entry.timestamp >= cutoff);
  }

  /**
   * Calculate average size over period
   */
  getAverage(days: number = 7): number {
    const trend = this.getTrend(days);
    if (trend.length === 0) return 0;

    const sum = trend.reduce((acc, entry) => acc + entry.totalSize, 0);
    return sum / trend.length;
  }

  /**
   * Get maximum size in history
   */
  getMaxSize(): number {
    if (this.history.length === 0) return 0;
    return Math.max(...this.history.map((e) => e.totalSize));
  }

  /**
   * Get minimum size in history
   */
  getMinSize(): number {
    if (this.history.length === 0) return 0;
    return Math.min(...this.history.map((e) => e.totalSize));
  }

  /**
   * Detect size spike (sudden increase)
   */
  detectSpike(threshold: number = 0.2): boolean {
    if (this.history.length < 2) return false;

    const current = this.history[this.history.length - 1];
    const previous = this.history[this.history.length - 2];

    const increase = (current.totalSize - previous.totalSize) / previous.totalSize;
    return increase > threshold;
  }

  /**
   * Export history as JSON
   */
  exportHistory(): string {
    return JSON.stringify(this.history, null, 2);
  }

  /**
   * Import history from JSON
   */
  importHistory(json: string): void {
    try {
      this.history = JSON.parse(json);
    } catch (error) {
      console.error('Failed to import size history:', error);
    }
  }

  /**
   * Clear history
   */
  clear(): void {
    this.history = [];
  }

  /**
   * Get full history
   */
  getHistory(): ISizeHistory[] {
    return [...this.history];
  }
}

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
