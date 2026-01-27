/**
 * Performance Monitor Types
 * Tracks performance metrics for registry operations
 */

import type { IApplicationRoot } from '../../bootstrap/application-root.interface';

/**
 * Type of registry operation being tracked
 */
export type OperationType =
  | 'register'
  | 'unregister'
  | 'lookup'
  | 'render'
  | 'event-dispatch'
  | 'cleanup';

/**
 * Single performance measurement
 */
export interface IPerformanceMeasurement {
  /** Type of operation */
  operation: OperationType;
  /** Duration in milliseconds */
  duration: number;
  /** Timestamp when operation started */
  timestamp: number;
  /** Element ID involved (if applicable) */
  elementId?: string;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Aggregated performance metrics
 */
export interface IPerformanceMetrics {
  /** Operation type */
  operation: OperationType;
  /** Total number of operations */
  count: number;
  /** Average duration (ms) */
  avgDuration: number;
  /** Minimum duration (ms) */
  minDuration: number;
  /** Maximum duration (ms) */
  maxDuration: number;
  /** Total time spent (ms) */
  totalDuration: number;
  /** 95th percentile duration (ms) */
  p95Duration: number;
  /** 99th percentile duration (ms) */
  p99Duration: number;
}

/**
 * Memory usage estimates
 */
export interface IMemoryMetrics {
  /** Total registered elements */
  elementCount: number;
  /** Total event handlers */
  handlerCount: number;
  /** Estimated metadata size (bytes) */
  estimatedMetadataSize: number;
  /** Estimated handler map size (bytes) */
  estimatedHandlerMapSize: number;
  /** Total estimated size (bytes) */
  totalEstimatedSize: number;
}

/**
 * Performance history query options
 */
export interface IHistoryQuery {
  /** Filter by operation type */
  operation?: OperationType;
  /** Include only after this timestamp */
  since?: number;
  /** Include only before this timestamp */
  until?: number;
  /** Maximum number of results */
  limit?: number;
}

/**
 * Performance Monitor
 * Tracks and analyzes registry operation performance
 */
export interface IPerformanceMonitor {
  /**
   * Constructor signature
   */
  new (appRoot: IApplicationRoot): IPerformanceMonitor;

  /**
   * Reference to ApplicationRoot
   */
  readonly appRoot: IApplicationRoot;

  /**
   * Maximum history size (prevents memory bloat)
   */
  maxHistorySize: number;

  /**
   * Track a performance measurement
   *
   * @param measurement - Performance data to record
   */
  trackOperation(measurement: IPerformanceMeasurement): void;

  /**
   * Get aggregated metrics for specific operation
   *
   * @param operation - Operation type to analyze
   * @returns Aggregated performance metrics
   */
  getMetrics(operation: OperationType): IPerformanceMetrics | null;

  /**
   * Get all operation metrics
   *
   * @returns Map of operation type to metrics
   */
  getAllMetrics(): Map<OperationType, IPerformanceMetrics>;

  /**
   * Get raw performance history
   *
   * @param query - Optional filter query
   * @returns Array of measurements
   */
  getHistory(query?: IHistoryQuery): IPerformanceMeasurement[];

  /**
   * Get memory usage estimates
   *
   * @returns Memory metrics
   */
  getMemoryMetrics(): IMemoryMetrics;

  /**
   * Clear all performance history
   */
  clearHistory(): void;

  /**
   * Get slowest operations
   *
   * @param limit - Maximum number of results
   * @returns Array of slowest measurements
   */
  getSlowestOperations(limit?: number): IPerformanceMeasurement[];

  /**
   * Start timing an operation (returns end callback)
   *
   * @param operation - Operation type
   * @param elementId - Optional element ID
   * @param metadata - Optional metadata
   * @returns Function to call when operation completes
   */
  startTimer(
    operation: OperationType,
    elementId?: string,
    metadata?: Record<string, unknown>
  ): () => void;
}
