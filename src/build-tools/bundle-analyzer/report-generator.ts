/**
 * @fileoverview Report generator for bundle analysis
 * @module @pulsar/build-tools/bundle-analyzer
 */

import { calculateCompressionRatio, formatBytes } from './bundle-analyzer';
import type { IBundleAnalysis, IReportOptions, ISizeComparison } from './bundle-analyzer.types';

/**
 * Generate bundle analysis report
 *
 * @example
 * ```typescript
 * const report = generateReport(analysis, {
 *   format: 'console',
 *   detailed: true,
 *   showSuggestions: true
 * });
 * ```
 */
export function generateReport(analysis: IBundleAnalysis, options: IReportOptions): string {
  switch (options.format) {
    case 'json':
      return generateJSONReport(analysis);

    case 'console':
      return generateConsoleReport(analysis, options);

    case 'markdown':
      return generateMarkdownReport(analysis, options);

    case 'html':
      return generateHTMLReport(analysis, options);

    default:
      return generateConsoleReport(analysis, options);
  }
}

/**
 * Generate JSON report
 */
function generateJSONReport(analysis: IBundleAnalysis): string {
  return JSON.stringify(analysis, null, 2);
}

/**
 * Generate console report
 */
function generateConsoleReport(analysis: IBundleAnalysis, options: IReportOptions): string {
  const lines: string[] = [];

  // Header
  lines.push('');
  lines.push('═══════════════════════════════════════════');
  lines.push('          Bundle Analysis Report           ');
  lines.push('═══════════════════════════════════════════');
  lines.push('');

  // Summary
  lines.push('📊 Summary:');
  lines.push(`  Total Size:     ${formatBytes(analysis.totalSize)}`);
  lines.push(`  Gzipped:        ${formatBytes(analysis.gzippedSize)}`);
  lines.push(
    `  Compression:    ${calculateCompressionRatio(analysis.totalSize, analysis.gzippedSize).toFixed(1)}%`
  );
  lines.push(`  Chunks:         ${analysis.chunkCount}`);
  lines.push(`  Modules:        ${analysis.moduleCount}`);
  lines.push('');

  // Chunks
  if (options.detailed) {
    lines.push('📦 Chunks:');
    for (const chunk of analysis.chunks.slice(0, 10)) {
      const type = chunk.entry ? '(entry)' : chunk.initial ? '(initial)' : '';
      lines.push(`  ${chunk.name.padEnd(30)} ${formatBytes(chunk.size).padStart(10)} ${type}`);
    }
    if (analysis.chunks.length > 10) {
      lines.push(`  ... and ${analysis.chunks.length - 10} more chunks`);
    }
    lines.push('');
  }

  // Largest modules
  if (options.detailed && analysis.largestModules.length > 0) {
    lines.push('📚 Largest Modules:');
    for (const module of analysis.largestModules.slice(0, 10)) {
      const path = truncatePath(module.path, 40);
      lines.push(`  ${path.padEnd(42)} ${formatBytes(module.size).padStart(10)}`);
    }
    lines.push('');
  }

  // Duplicates
  if (analysis.duplicates.length > 0) {
    lines.push('⚠️  Duplicate Modules:');
    for (const dup of analysis.duplicates.slice(0, 5)) {
      lines.push(
        `  ${truncatePath(dup.path, 40)} (${dup.occurrences}x) - wasted ${formatBytes(dup.wastedSize)}`
      );
    }
    if (analysis.duplicates.length > 5) {
      lines.push(`  ... and ${analysis.duplicates.length - 5} more duplicates`);
    }
    lines.push('');
  }

  // Suggestions
  if (options.showSuggestions && analysis.suggestions.length > 0) {
    lines.push('💡 Optimization Suggestions:');
    for (const suggestion of analysis.suggestions) {
      const icon = getSeverityIcon(suggestion.severity);
      lines.push(`  ${icon} [${suggestion.type.toUpperCase()}] ${suggestion.message}`);
      lines.push(`     → ${suggestion.action}`);
      if (suggestion.potentialSavings) {
        lines.push(`     Potential savings: ${formatBytes(suggestion.potentialSavings)}`);
      }
      lines.push('');
    }
  }

  lines.push('═══════════════════════════════════════════');
  lines.push('');

  return lines.join('\n');
}

/**
 * Generate Markdown report
 */
function generateMarkdownReport(analysis: IBundleAnalysis, options: IReportOptions): string {
  const lines: string[] = [];

  lines.push('# Bundle Analysis Report');
  lines.push('');
  lines.push(`*Generated on ${new Date(analysis.timestamp).toLocaleString()}*`);
  lines.push('');

  // Summary
  lines.push('## Summary');
  lines.push('');
  lines.push('| Metric | Value |');
  lines.push('|--------|-------|');
  lines.push(`| Total Size | ${formatBytes(analysis.totalSize)} |`);
  lines.push(`| Gzipped Size | ${formatBytes(analysis.gzippedSize)} |`);
  lines.push(
    `| Compression Ratio | ${calculateCompressionRatio(analysis.totalSize, analysis.gzippedSize).toFixed(1)}% |`
  );
  lines.push(`| Chunks | ${analysis.chunkCount} |`);
  lines.push(`| Modules | ${analysis.moduleCount} |`);
  lines.push('');

  // Chunks
  if (options.detailed) {
    lines.push('## Chunks');
    lines.push('');
    lines.push('| Name | Size | Type |');
    lines.push('|------|------|------|');
    for (const chunk of analysis.chunks) {
      const type = chunk.entry ? 'Entry' : chunk.initial ? 'Initial' : 'Async';
      lines.push(`| \`${chunk.name}\` | ${formatBytes(chunk.size)} | ${type} |`);
    }
    lines.push('');
  }

  // Suggestions
  if (options.showSuggestions && analysis.suggestions.length > 0) {
    lines.push('## Optimization Suggestions');
    lines.push('');
    for (const suggestion of analysis.suggestions) {
      const emoji = getSeverityEmoji(suggestion.severity);
      lines.push(`### ${emoji} ${suggestion.type.toUpperCase()}: ${suggestion.severity}`);
      lines.push('');
      lines.push(`**Issue:** ${suggestion.message}`);
      lines.push('');
      lines.push(`**Action:** ${suggestion.action}`);
      lines.push('');
      if (suggestion.potentialSavings) {
        lines.push(`**Potential Savings:** ${formatBytes(suggestion.potentialSavings)}`);
        lines.push('');
      }
    }
  }

  return lines.join('\n');
}

/**
 * Generate HTML report
 */
function generateHTMLReport(analysis: IBundleAnalysis, options: IReportOptions): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Bundle Analysis Report</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      background: #f5f5f5;
    }
    h1 { color: #333; }
    h2 { color: #666; border-bottom: 2px solid #ddd; padding-bottom: 10px; }
    .summary {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin: 20px 0;
    }
    .metric { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
    .metric:last-child { border-bottom: none; }
    .label { font-weight: 600; color: #666; }
    .value { color: #333; }
    table { width: 100%; border-collapse: collapse; background: white; margin: 20px 0; border-radius: 8px; overflow: hidden; }
    th, td { padding: 12px; text-align: left; }
    th { background: #f8f9fa; font-weight: 600; color: #666; }
    tr:nth-child(even) { background: #f8f9fa; }
    .suggestion { background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #ffc107; }
    .high { border-left-color: #f44336; }
    .critical { border-left-color: #d32f2f; background: #ffebee; }
  </style>
</head>
<body>
  <h1>📊 Bundle Analysis Report</h1>
  <p><em>Generated on ${new Date(analysis.timestamp).toLocaleString()}</em></p>

  <div class="summary">
    <h2>Summary</h2>
    <div class="metric"><span class="label">Total Size:</span><span class="value">${formatBytes(analysis.totalSize)}</span></div>
    <div class="metric"><span class="label">Gzipped Size:</span><span class="value">${formatBytes(analysis.gzippedSize)}</span></div>
    <div class="metric"><span class="label">Compression Ratio:</span><span class="value">${calculateCompressionRatio(analysis.totalSize, analysis.gzippedSize).toFixed(1)}%</span></div>
    <div class="metric"><span class="label">Chunks:</span><span class="value">${analysis.chunkCount}</span></div>
    <div class="metric"><span class="label">Modules:</span><span class="value">${analysis.moduleCount}</span></div>
  </div>

  ${
    options.showSuggestions && analysis.suggestions.length > 0
      ? `
    <h2>💡 Optimization Suggestions</h2>
    ${analysis.suggestions
      .map(
        (s) => `
      <div class="suggestion ${s.severity}">
        <strong>[${s.type.toUpperCase()}] ${s.severity.toUpperCase()}</strong>
        <p>${s.message}</p>
        <p><strong>Action:</strong> ${s.action}</p>
        ${s.potentialSavings ? `<p><strong>Potential Savings:</strong> ${formatBytes(s.potentialSavings)}</p>` : ''}
      </div>
    `
      )
      .join('')}
  `
      : ''
  }
</body>
</html>`;
}

/**
 * Get severity icon for console
 */
function getSeverityIcon(severity: string): string {
  switch (severity) {
    case 'critical':
      return '🔴';
    case 'high':
      return '🟠';
    case 'medium':
      return '🟡';
    case 'low':
      return '🔵';
    default:
      return '⚪';
  }
}

/**
 * Get severity emoji for markdown
 */
function getSeverityEmoji(severity: string): string {
  switch (severity) {
    case 'critical':
      return '🚨';
    case 'high':
      return '⚠️';
    case 'medium':
      return '💡';
    case 'low':
      return 'ℹ️';
    default:
      return '📝';
  }
}

/**
 * Truncate path for display
 */
function truncatePath(path: string, maxLength: number): string {
  if (path.length <= maxLength) return path;

  const parts = path.split('/');
  if (parts.length <= 2) {
    return path.substring(0, maxLength - 3) + '...';
  }

  // Keep first and last parts
  return parts[0] + '/.../' + parts[parts.length - 1];
}

/**
 * Generate size comparison report
 */
export function generateComparisonReport(
  current: IBundleAnalysis,
  comparison: ISizeComparison
): string {
  const lines: string[] = [];

  lines.push('');
  lines.push('📈 Size Comparison:');
  lines.push(`  Previous: ${formatBytes(comparison.previous)}`);
  lines.push(`  Current:  ${formatBytes(comparison.current)}`);

  const sign = comparison.increased ? '+' : '';
  const color = comparison.increased ? '🔴' : '🟢';

  lines.push(
    `  Change:   ${color} ${sign}${formatBytes(comparison.difference)} (${sign}${comparison.percentChange.toFixed(2)}%)`
  );
  lines.push('');

  return lines.join('\n');
}
