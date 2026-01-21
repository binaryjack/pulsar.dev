/**
 * @fileoverview Bundle analysis tools
 * @module @pulsar/build-tools/bundle-analyzer
 *
 * @example
 * ```typescript
 * import { analyzeBundle, generateReport, SizeTracker } from 'pulsar/build-tools';
 *
 * // Analyze bundle
 * const analysis = await analyzeBundle(buildStats, {
 *   analyzeGzip: true,
 *   detectDuplicates: true
 * });
 *
 * // Generate report
 * const report = generateReport(analysis, {
 *   format: 'console',
 *   detailed: true
 * });
 * console.log(report);
 *
 * // Track sizes over time
 * const tracker = new SizeTracker();
 * tracker.record(analysis);
 * ```
 */

export { analyzeBundle, calculateCompressionRatio, formatBytes } from './bundle-analyzer';
export {
  estimateCompressionRatio,
  estimateTotalGzipSize,
  gzipSize,
  isCompressible,
} from './gzip-utils';
export { generateComparisonReport, generateReport } from './report-generator';
export { calculateBudgetRemaining, checkSizeThreshold, SizeTracker } from './size-tracker';

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
} from './bundle-analyzer.types';
