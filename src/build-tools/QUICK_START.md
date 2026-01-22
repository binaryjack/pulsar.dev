# Pulsar Build Tools - Quick Start

## Bundle Analyzer

The bundle analyzer helps you understand your build output, track sizes, and identify optimization opportunities.

## Installation

```bash
pnpm add pulsar
```

## Quick Start

### 1. Vite Plugin (Recommended)

Add to `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import { bundleAnalyzer } from 'pulsar/build-tools';

export default defineConfig({
  plugins: [
    bundleAnalyzer({
      // Auto-analyze production builds
      enabled: process.env.NODE_ENV === 'production',

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
    }),
  ],
});
```

**Output:**

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
  🟠 [SPLIT] Chunk "vendor.js" is large
     → Consider splitting into smaller chunks
     Potential savings: 17.82 KB
```

### 2. Programmatic API

```typescript
import { analyzeBundle, generateReport, SizeTracker } from 'pulsar/build-tools';

// Analyze your build
const analysis = await analyzeBundle(buildStats, {
  analyzeGzip: true,
  detectDuplicates: true,
  generateSuggestions: true,
});

// Generate report
const report = generateReport(analysis, {
  format: 'console',
  detailed: true,
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

### 3. CLI

```bash
# Analyze build stats
pulsar-analyze --stats dist/stats.json

# Generate HTML report
pulsar-analyze --stats dist/stats.json --format html --output report.html

# Compare with previous build
pulsar-analyze --stats current.json --compare previous.json
```

## Features

- ✅ **Size Tracking** - Monitor bundle growth over time
- ✅ **Duplicate Detection** - Find repeated modules
- ✅ **Optimization Tips** - Automatic suggestions
- ✅ **Multiple Formats** - Console, JSON, HTML, Markdown
- ✅ **CI/CD Ready** - Threshold-based failures
- ✅ **Gzip Analysis** - Estimate compressed sizes

## CI/CD Integration

### GitHub Actions

```yaml
- name: Build and analyze
  run: |
    pnpm build
    pulsar-analyze --stats dist/stats.json --fail-on-critical
```

### Enforce Size Budgets

```typescript
bundleAnalyzer({
  analysis: {
    thresholds: {
      critical: 1024 * 1024, // 1MB
    },
  },
  failOnThreshold: process.env.CI === 'true',
});
```

## Next Steps

- Read full documentation: `src/build-tools/bundle-analyzer/README.md`
- Explore report formats
- Set up size tracking
- Configure CI/CD pipelines

## Example Output (HTML Report)

The HTML report includes:

- Interactive summary metrics
- Sortable chunk table
- Color-coded suggestions
- Historical size comparisons
- Export/share capabilities

Generate with:

```bash
pulsar-analyze --stats build-stats.json --format html --output report.html
```
