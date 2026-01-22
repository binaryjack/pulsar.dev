# Bundle Analyzer

Comprehensive bundle analysis tools for tracking sizes, detecting issues, and optimizing builds.

## Features

- 📊 **Bundle Analysis** - Track total size, chunks, modules, and dependencies
- 📈 **Size Tracking** - Monitor bundle growth over time
- 🔍 **Duplicate Detection** - Find and report duplicate modules
- 💡 **Optimization Suggestions** - Automatic recommendations for improvements
- 📝 **Multiple Report Formats** - Console, JSON, HTML, Markdown
- 🔌 **Vite Plugin** - Seamless integration with Vite builds
- 🎯 **Size Budgets** - Enforce size thresholds in CI/CD
- ⚡ **Gzip Analysis** - Estimate compressed sizes

## Installation

```bash
pnpm add pulsar
```

## Usage

### Vite Plugin

Add to your `vite.config.ts`:

```typescript
import { bundleAnalyzer } from 'pulsar/build-tools';

export default {
  plugins: [
    bundleAnalyzer({
      report: {
        format: 'console',
        detailed: true,
        showSuggestions: true,
      },
      analysis: {
        detectDuplicates: true,
        analyzeGzip: true,
        thresholds: {
          warning: 250 * 1024, // 250KB
          error: 500 * 1024, // 500KB
          critical: 1024 * 1024, // 1MB
        },
      },
      failOnThreshold: process.env.CI === 'true',
    }),
  ],
};
```

### Programmatic API

```typescript
import { analyzeBundle, generateReport, SizeTracker } from 'pulsar/build-tools';

// Analyze bundle
const analysis = await analyzeBundle(buildStats, {
  analyzeGzip: true,
  detectDuplicates: true,
  generateSuggestions: true,
});

// Generate console report
const report = generateReport(analysis, {
  format: 'console',
  detailed: true,
  showSuggestions: true,
});
console.log(report);

// Track sizes over time
const tracker = new SizeTracker();
tracker.record(analysis);

const comparison = tracker.compareWithPrevious(analysis);
if (comparison) {
  console.log(`Size changed by ${comparison.percentChange.toFixed(2)}%`);
}
```

### CLI

```bash
# Analyze build stats
pulsar-analyze --stats build-stats.json --format console

# Generate HTML report
pulsar-analyze --stats build-stats.json --format html --output report.html

# Compare with previous build
pulsar-analyze --stats current.json --compare previous.json

# Fail on critical issues (CI/CD)
pulsar-analyze --stats build-stats.json --fail-on-critical
```

## Report Formats

### Console

```
═══════════════════════════════════════════
          Bundle Analysis Report
═══════════════════════════════════════════

📊 Summary:
  Total Size:     245.67 KB
  Gzipped:        78.23 KB
  Compression:    68.2%
  Chunks:         12
  Modules:        156

📦 Chunks:
  index.js                       123.45 KB (entry)
  vendor.js                       89.12 KB (initial)
  lazy-route.js                   12.34 KB

💡 Optimization Suggestions:
  🟠 [SPLIT] Chunk "vendor.js" is large (89.12 KB)
     → Consider splitting into smaller chunks
     Potential savings: 17.82 KB
```

### JSON

```json
{
  "totalSize": 251578,
  "gzippedSize": 80123,
  "chunkCount": 12,
  "moduleCount": 156,
  "chunks": [...],
  "suggestions": [...]
}
```

### HTML

Generates interactive HTML report with:

- Summary metrics
- Chunk breakdown table
- Optimization suggestions with severity colors
- Size comparisons

### Markdown

Perfect for GitHub PRs and documentation:

```markdown
# Bundle Analysis Report

## Summary

| Metric            | Value     |
| ----------------- | --------- |
| Total Size        | 245.67 KB |
| Gzipped Size      | 78.23 KB  |
| Compression Ratio | 68.2%     |
```

## Size Tracking

Track bundle sizes over time:

```typescript
const tracker = new SizeTracker();

// Record each build
tracker.record(analysis);

// Get trend
const trend = tracker.getTrend(7); // Last 7 days

// Detect spikes
if (tracker.detectSpike(0.2)) {
  console.warn('⚠️ Size increased by >20%');
}

// Export history
const json = tracker.exportHistory();
fs.writeFileSync('size-history.json', json);
```

## Optimization Suggestions

The analyzer automatically detects issues and provides actionable suggestions:

### Large Chunks

```typescript
{
  type: 'split',
  severity: 'high',
  message: 'Chunk "vendor.js" is large (245 KB)',
  action: 'Consider splitting into smaller chunks',
  potentialSavings: 49000
}
```

### Duplicate Modules

```typescript
{
  type: 'dedupe',
  severity: 'medium',
  message: 'Module "lodash" is duplicated 3 times',
  action: 'Extract common dependencies into shared chunk',
  potentialSavings: 156000
}
```

### Lazy Loading Opportunities

```typescript
{
  type: 'lazy',
  severity: 'medium',
  message: 'Large module "chart-lib.js" (120 KB)',
  action: 'Consider lazy loading if not needed immediately',
  potentialSavings: 120000
}
```

## Size Budgets

Enforce size limits in CI/CD:

```typescript
bundleAnalyzer({
  analysis: {
    thresholds: {
      warning: 250 * 1024, // 250KB
      error: 500 * 1024, // 500KB
      critical: 1024 * 1024, // 1MB
    },
  },
  failOnThreshold: true,
});
```

## API Reference

### analyzeBundle()

```typescript
function analyzeBundle(buildData: any, options?: IBundleAnalysisOptions): Promise<IBundleAnalysis>;
```

### generateReport()

```typescript
function generateReport(analysis: IBundleAnalysis, options: IReportOptions): string;
```

### SizeTracker

```typescript
class SizeTracker {
  record(analysis: IBundleAnalysis): void;
  compareWithPrevious(current: IBundleAnalysis): ISizeComparison | null;
  getTrend(days: number): ISizeHistory[];
  detectSpike(threshold: number): boolean;
  exportHistory(): string;
  importHistory(json: string): void;
}
```

## Integration Examples

### GitHub Actions

```yaml
- name: Analyze bundle
  run: |
    pnpm build
    pulsar-analyze --stats dist/stats.json --fail-on-critical
```

### Pre-commit Hook

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "pnpm build && pulsar-analyze --stats dist/stats.json"
    }
  }
}
```

### CI Size Comparison

```typescript
// Compare with main branch
const mainStats = await fetch('main-branch-stats.json');
const currentAnalysis = await analyzeBundle(currentStats);
const mainAnalysis = await analyzeBundle(mainStats);

const diff = currentAnalysis.totalSize - mainAnalysis.totalSize;
if (diff > 50000) {
  // 50KB increase
  throw new Error(`Bundle grew by ${formatBytes(diff)}`);
}
```

## Best Practices

1. **Enable in Production Builds**
   - Only analyze production builds to avoid overhead
   - Use `process.env.NODE_ENV === 'production'`

2. **Track History**
   - Store size history in version control
   - Monitor trends over time

3. **Set Realistic Thresholds**
   - Start with current sizes + 20%
   - Gradually decrease over time

4. **Act on Suggestions**
   - Review high/critical suggestions first
   - Implement code splitting for large chunks
   - Deduplicate common dependencies

5. **Compare with Previous Builds**
   - Always compare against previous versions
   - Investigate unexpected size increases

## Troubleshooting

### No Stats Available

Ensure your build tool outputs stats:

```typescript
// Vite
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['react', 'react-dom'];
      }
    }
  }
}
```

### Inaccurate Gzip Sizes

For accurate gzipped sizes, use actual compression:

```typescript
import { gzip } from 'zlib';
import { promisify } from 'util';

const gzipAsync = promisify(gzip);
const compressed = await gzipAsync(Buffer.from(code));
const gzipSize = compressed.length;
```

## Performance

- Analysis time: ~100ms for typical builds
- Memory usage: <50MB for most projects
- Scales to 10,000+ modules

## License

MIT
