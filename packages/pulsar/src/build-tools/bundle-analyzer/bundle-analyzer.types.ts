/**
 * @fileoverview Type definitions for bundle analysis
 * @module @pulsar/build-tools/bundle-analyzer
 */

/**
 * Bundle analysis result
 */
export interface IBundleAnalysis {
  /** Total bundle size (bytes) */
  totalSize: number;

  /** Total gzipped size (bytes) */
  gzippedSize: number;

  /** Number of modules */
  moduleCount: number;

  /** Number of chunks */
  chunkCount: number;

  /** Chunks breakdown */
  chunks: IChunkInfo[];

  /** Largest modules */
  largestModules: IModuleInfo[];

  /** Duplicate modules */
  duplicates: IDuplicateModule[];

  /** Optimization suggestions */
  suggestions: IOptimizationSuggestion[];

  /** Analysis timestamp */
  timestamp: number;
}

/**
 * Chunk information
 */
export interface IChunkInfo {
  /** Chunk name/ID */
  name: string;

  /** Chunk size (bytes) */
  size: number;

  /** Gzipped size (bytes) */
  gzippedSize: number;

  /** Modules in this chunk */
  modules: string[];

  /** Is this an initial chunk? */
  initial: boolean;

  /** Parent chunks */
  parents: string[];

  /** Child chunks */
  children: string[];

  /** Entry point */
  entry?: boolean;
}

/**
 * Module information
 */
export interface IModuleInfo {
  /** Module path */
  path: string;

  /** Module size (bytes) */
  size: number;

  /** Gzipped size (bytes) */
  gzippedSize: number;

  /** Number of chunks using this module */
  usageCount: number;

  /** Chunks containing this module */
  chunks: string[];
}

/**
 * Duplicate module detection
 */
export interface IDuplicateModule {
  /** Module path */
  path: string;

  /** Number of occurrences */
  occurrences: number;

  /** Chunks containing duplicates */
  chunks: string[];

  /** Total wasted size (bytes) */
  wastedSize: number;
}

/**
 * Optimization suggestion
 */
export interface IOptimizationSuggestion {
  /** Suggestion type */
  type: 'split' | 'lazy' | 'dedupe' | 'treeshake' | 'minify';

  /** Severity level */
  severity: 'low' | 'medium' | 'high' | 'critical';

  /** Description */
  message: string;

  /** Estimated savings (bytes) */
  potentialSavings?: number;

  /** Affected modules/chunks */
  affected: string[];

  /** Recommended action */
  action: string;
}

/**
 * Bundle size thresholds
 */
export interface IBundleSizeThresholds {
  /** Warning threshold (bytes) */
  warning: number;

  /** Error threshold (bytes) */
  error: number;

  /** Critical threshold (bytes) */
  critical: number;
}

/**
 * Bundle analysis options
 */
export interface IBundleAnalysisOptions {
  /** Include source maps in analysis */
  includeSourceMaps?: boolean;

  /** Analyze gzipped sizes */
  analyzeGzip?: boolean;

  /** Detect duplicate modules */
  detectDuplicates?: boolean;

  /** Generate optimization suggestions */
  generateSuggestions?: boolean;

  /** Size thresholds */
  thresholds?: IBundleSizeThresholds;

  /** Maximum modules to report */
  maxModules?: number;
}

/**
 * Build statistics
 */
export interface IBuildStats {
  /** Build timestamp */
  timestamp: number;

  /** Build duration (ms) */
  duration: number;

  /** Bundle analysis */
  analysis: IBundleAnalysis;

  /** Build warnings */
  warnings: string[];

  /** Build errors */
  errors: string[];

  /** Environment (production/development) */
  environment: 'production' | 'development';
}

/**
 * Size comparison result
 */
export interface ISizeComparison {
  /** Current size */
  current: number;

  /** Previous size */
  previous: number;

  /** Size difference (bytes) */
  difference: number;

  /** Percentage change */
  percentChange: number;

  /** Is increase? */
  increased: boolean;
}

/**
 * Report format
 */
export type ReportFormat = 'json' | 'html' | 'console' | 'markdown';

/**
 * Report options
 */
export interface IReportOptions {
  /** Output format */
  format: ReportFormat;

  /** Output file path (for file formats) */
  outputPath?: string;

  /** Include detailed module breakdown */
  detailed?: boolean;

  /** Show optimization suggestions */
  showSuggestions?: boolean;

  /** Compare with previous build */
  compare?: boolean;

  /** Previous build stats path */
  previousStatsPath?: string;
}
