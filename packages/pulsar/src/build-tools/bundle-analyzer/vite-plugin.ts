/**
 * @fileoverview Vite plugin for bundle analysis
 * @module @pulsar/build-tools/bundle-analyzer
 */

import type { Plugin } from 'vite';
import type { IBundleAnalysisOptions, IReportOptions } from './bundle-analyzer.types';
import { analyzeBundle, generateReport, SizeTracker } from './index';

export interface BundleAnalyzerPluginOptions {
  /** Analysis options */
  analysis?: IBundleAnalysisOptions;

  /** Report options */
  report?: IReportOptions;

  /** Enable analysis */
  enabled?: boolean;

  /** Track size history */
  trackHistory?: boolean;

  /** Fail build on size threshold */
  failOnThreshold?: boolean;
}

/**
 * Vite plugin for bundle analysis
 *
 * @example
 * ```typescript
 * // vite.config.ts
 * import { bundleAnalyzer } from 'pulsar/build-tools';
 *
 * export default {
 *   plugins: [
 *     bundleAnalyzer({
 *       report: { format: 'console', detailed: true },
 *       analysis: { detectDuplicates: true }
 *     })
 *   ]
 * };
 * ```
 */
export function bundleAnalyzer(options: BundleAnalyzerPluginOptions = {}): Plugin {
  const {
    enabled = process.env.ANALYZE === 'true' || process.env.NODE_ENV === 'production',
    trackHistory = true,
    failOnThreshold = false,
    analysis = {},
    report = { format: 'console', detailed: true, showSuggestions: true },
  } = options;

  const tracker = trackHistory ? new SizeTracker() : null;
  let buildStartTime = 0;

  return {
    name: 'pulsar-bundle-analyzer',

    apply: 'build',

    buildStart() {
      if (enabled) {
        buildStartTime = Date.now();
        console.log('\n🔍 Pulsar Bundle Analyzer - Starting analysis...\n');
      }
    },

    async closeBundle() {
      if (!enabled) return;

      try {
        // Get Vite build info
        const buildInfo = await this.load({ id: 'virtual:bundle-info' });

        // Analyze bundle
        const bundleAnalysis = await analyzeBundle(buildInfo || {}, {
          analyzeGzip: true,
          detectDuplicates: true,
          generateSuggestions: true,
          ...analysis,
        });

        // Track history
        if (tracker) {
          const comparison = tracker.compareWithPrevious(bundleAnalysis);
          tracker.record(bundleAnalysis);

          if (comparison) {
            const comparisonReport = await import('./report-generator').then((m) =>
              m.generateComparisonReport(bundleAnalysis, comparison)
            );
            console.log(comparisonReport);
          }
        }

        // Generate report
        const reportText = generateReport(bundleAnalysis, report);
        console.log(reportText);

        // Check thresholds
        if (failOnThreshold && analysis.thresholds) {
          const { error, critical } = analysis.thresholds;

          if (bundleAnalysis.totalSize >= critical) {
            throw new Error(
              `Bundle size (${bundleAnalysis.totalSize} bytes) exceeds critical threshold (${critical} bytes)`
            );
          }

          if (bundleAnalysis.totalSize >= error) {
            this.warn(
              `Bundle size (${bundleAnalysis.totalSize} bytes) exceeds error threshold (${error} bytes)`
            );
          }
        }

        // Save report to file if specified
        if (report.outputPath) {
          const fs = await import('fs');
          const path = await import('path');

          const outputDir = path.dirname(report.outputPath);
          if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
          }

          fs.writeFileSync(report.outputPath, reportText, 'utf-8');
          console.log(`\n📄 Report saved to: ${report.outputPath}\n`);
        }

        const duration = Date.now() - buildStartTime;
        console.log(`✅ Bundle analysis complete (${duration}ms)\n`);
      } catch (error) {
        console.error('❌ Bundle analysis failed:', error);
        if (failOnThreshold) {
          throw error;
        }
      }
    },
  };
}

/**
 * Create bundle analyzer with custom configuration
 */
export function createBundleAnalyzer(config: BundleAnalyzerPluginOptions): Plugin {
  return bundleAnalyzer(config);
}
