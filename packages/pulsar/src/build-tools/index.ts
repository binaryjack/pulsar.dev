/**
 * @fileoverview Build tools and optimization utilities
 * @module @pulsar/build-tools
 */

export {
  SizeTracker,
  analyzeBundle,
  calculateBudgetRemaining,
  calculateCompressionRatio,
  checkSizeThreshold,
  estimateCompressionRatio,
  estimateTotalGzipSize,
  formatBytes,
  generateComparisonReport,
  generateReport,
  gzipSize,
  isCompressible,
} from './bundle-analyzer';

export { runCLI } from './bundle-analyzer/cli';
export { bundleAnalyzer, createBundleAnalyzer } from './bundle-analyzer/vite-plugin';

export type {
  IBuildStats,
  IBundleAnalysis,
  IBundleAnalysisOptions,
  IBundleSizeThresholds,
  IChunkInfo,
  IDuplicateModule,
  IModuleInfo,
  IOptimizationSuggestion,
  IReportOptions,
  ISizeComparison,
  ReportFormat,
} from './bundle-analyzer';
