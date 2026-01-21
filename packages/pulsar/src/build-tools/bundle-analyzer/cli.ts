/**
 * @fileoverview CLI for bundle analysis
 * @module @pulsar/build-tools/bundle-analyzer
 */

import type { IReportOptions } from './bundle-analyzer.types';
import { analyzeBundle, generateReport } from './index';

/**
 * CLI interface for bundle analysis
 *
 * @example
 * ```bash
 * # Analyze build stats
 * pulsar-analyze --stats build-stats.json --format console
 *
 * # Generate HTML report
 * pulsar-analyze --stats build-stats.json --format html --output report.html
 *
 * # Compare with previous build
 * pulsar-analyze --stats build-stats.json --compare previous-stats.json
 * ```
 */
export async function runCLI(args: string[]): Promise<void> {
  const options = parseArgs(args);

  if (options.help) {
    printHelp();
    return;
  }

  if (!options.statsPath) {
    console.error('❌ Error: --stats option is required');
    printHelp();
    process.exit(1);
  }

  try {
    // Read stats file
    const fs = await import('fs');
    const statsContent = fs.readFileSync(options.statsPath, 'utf-8');
    const stats = JSON.parse(statsContent);

    // Analyze bundle
    console.log('\n🔍 Analyzing bundle...\n');

    const analysis = await analyzeBundle(stats, {
      analyzeGzip: options.gzip,
      detectDuplicates: options.duplicates,
      generateSuggestions: options.suggestions,
      maxModules: options.maxModules,
    });

    // Generate report
    const reportOptions: IReportOptions = {
      format: options.format,
      outputPath: options.output,
      detailed: options.detailed,
      showSuggestions: options.suggestions,
      compare: !!options.comparePath,
      previousStatsPath: options.comparePath,
    };

    const report = generateReport(analysis, reportOptions);

    // Output report
    if (options.output) {
      const fs = await import('fs');
      const path = await import('path');

      const outputDir = path.dirname(options.output);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      fs.writeFileSync(options.output, report, 'utf-8');
      console.log(`✅ Report saved to: ${options.output}`);
    } else {
      console.log(report);
    }

    // Exit with error if critical issues found
    const critical = analysis.suggestions.filter((s) => s.severity === 'critical');
    if (critical.length > 0 && options.failOnCritical) {
      console.error(`\n❌ Found ${critical.length} critical issues`);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Analysis failed:', error);
    process.exit(1);
  }
}

/**
 * Parse command-line arguments
 */
function parseArgs(args: string[]): any {
  const options: any = {
    format: 'console',
    gzip: true,
    duplicates: true,
    suggestions: true,
    detailed: true,
    maxModules: 20,
    failOnCritical: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    switch (arg) {
      case '--help':
      case '-h':
        options.help = true;
        break;

      case '--stats':
      case '-s':
        options.statsPath = args[++i];
        break;

      case '--format':
      case '-f':
        options.format = args[++i];
        break;

      case '--output':
      case '-o':
        options.output = args[++i];
        break;

      case '--compare':
      case '-c':
        options.comparePath = args[++i];
        break;

      case '--no-gzip':
        options.gzip = false;
        break;

      case '--no-duplicates':
        options.duplicates = false;
        break;

      case '--no-suggestions':
        options.suggestions = false;
        break;

      case '--max-modules':
        options.maxModules = parseInt(args[++i], 10);
        break;

      case '--fail-on-critical':
        options.failOnCritical = true;
        break;

      case '--summary':
        options.detailed = false;
        break;
    }
  }

  return options;
}

/**
 * Print help message
 */
function printHelp(): void {
  console.log(`
Pulsar Bundle Analyzer CLI

Usage:
  pulsar-analyze --stats <path> [options]

Options:
  --stats, -s <path>       Path to build stats JSON file (required)
  --format, -f <format>    Output format: console|json|html|markdown (default: console)
  --output, -o <path>      Output file path (default: stdout)
  --compare, -c <path>     Compare with previous stats file
  --no-gzip                Disable gzip size analysis
  --no-duplicates          Disable duplicate detection
  --no-suggestions         Disable optimization suggestions
  --max-modules <n>        Maximum modules to report (default: 20)
  --fail-on-critical       Exit with error on critical issues
  --summary                Show summary only (less detailed)
  --help, -h               Show this help message

Examples:
  # Basic analysis
  pulsar-analyze --stats build-stats.json

  # Generate HTML report
  pulsar-analyze --stats build-stats.json --format html --output report.html

  # Compare with previous build
  pulsar-analyze --stats current.json --compare previous.json

  # Fail on critical issues (CI/CD)
  pulsar-analyze --stats build-stats.json --fail-on-critical
`);
}

// Run CLI if executed directly
if (require.main === module) {
  runCLI(process.argv.slice(2));
}
