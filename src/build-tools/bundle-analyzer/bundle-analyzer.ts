/**
 * @fileoverview Bundle analyzer for tracking sizes and chunks
 * @module @pulsar/build-tools/bundle-analyzer
 */

import type {
  IBundleAnalysis,
  IBundleAnalysisOptions,
  IChunkInfo,
  IDuplicateModule,
  IModuleInfo,
} from './bundle-analyzer.types';

/**
 * Analyze bundle composition and sizes
 *
 * @example
 * ```typescript
 * const analysis = await analyzeBundle({
 *   chunks: buildStats.chunks,
 *   analyzeGzip: true,
 *   detectDuplicates: true
 * });
 *
 * console.log(`Total size: ${formatBytes(analysis.totalSize)}`);
 * ```
 */
export async function analyzeBundle(
  buildData: any,
  options: IBundleAnalysisOptions = {}
): Promise<IBundleAnalysis> {
  const {
    analyzeGzip = true,
    detectDuplicates = true,
    generateSuggestions = true,
    maxModules = 20,
  } = options;

  // Extract chunks and modules from build data
  const chunks = extractChunks(buildData);
  const modules = extractModules(buildData);

  // Calculate total sizes
  let totalSize = 0;
  let gzippedSize = 0;

  for (const chunk of chunks) {
    totalSize += chunk.size;
    if (analyzeGzip) {
      gzippedSize += chunk.gzippedSize;
    }
  }

  // Find largest modules
  const sortedModules = modules.sort((a, b) => b.size - a.size);
  const largestModules = sortedModules.slice(0, maxModules);

  // Detect duplicates
  const duplicates = detectDuplicates ? findDuplicateModules(modules) : [];

  // Generate suggestions
  const suggestions = generateSuggestions
    ? generateOptimizationSuggestions(chunks, modules, duplicates, options)
    : [];

  return {
    totalSize,
    gzippedSize,
    moduleCount: modules.length,
    chunkCount: chunks.length,
    chunks,
    largestModules,
    duplicates,
    suggestions,
    timestamp: Date.now(),
  };
}

/**
 * Extract chunk information from build data
 */
function extractChunks(buildData: any): IChunkInfo[] {
  const chunks: IChunkInfo[] = [];

  // Handle different build tool formats (Vite, Webpack, Rollup)
  if (buildData.output) {
    // Vite/Rollup format
    for (const [fileName, output] of Object.entries(buildData.output)) {
      const chunk = output as any;
      if (chunk.type === 'chunk') {
        chunks.push({
          name: fileName,
          size: chunk.code?.length || 0,
          gzippedSize: 0, // Will be calculated if needed
          modules: chunk.modules ? Object.keys(chunk.modules) : [],
          initial: chunk.isEntry || false,
          parents: [],
          children: [],
          entry: chunk.isEntry,
        });
      }
    }
  } else if (buildData.chunks) {
    // Webpack format
    for (const chunk of buildData.chunks) {
      chunks.push({
        name: chunk.names?.[0] || chunk.id,
        size: chunk.size || 0,
        gzippedSize: 0,
        modules: chunk.modules?.map((m: any) => m.name || m.id) || [],
        initial: chunk.initial || false,
        parents: chunk.parents || [],
        children: chunk.children || [],
        entry: chunk.entry,
      });
    }
  }

  return chunks;
}

/**
 * Extract module information from build data
 */
function extractModules(buildData: any): IModuleInfo[] {
  const moduleMap = new Map<string, IModuleInfo>();

  // Extract from chunks
  const chunks = extractChunks(buildData);

  for (const chunk of chunks) {
    for (const modulePath of chunk.modules) {
      if (!moduleMap.has(modulePath)) {
        moduleMap.set(modulePath, {
          path: modulePath,
          size: 0,
          gzippedSize: 0,
          usageCount: 0,
          chunks: [],
        });
      }

      const module = moduleMap.get(modulePath)!;
      module.usageCount++;
      module.chunks.push(chunk.name);
    }
  }

  // Estimate module sizes (rough approximation)
  for (const chunk of chunks) {
    const moduleCount = chunk.modules.length;
    const avgModuleSize = moduleCount > 0 ? chunk.size / moduleCount : 0;

    for (const modulePath of chunk.modules) {
      const module = moduleMap.get(modulePath)!;
      module.size = Math.max(module.size, avgModuleSize);
    }
  }

  return Array.from(moduleMap.values());
}

/**
 * Find duplicate modules across chunks
 */
function findDuplicateModules(modules: IModuleInfo[]): IDuplicateModule[] {
  const duplicates: IDuplicateModule[] = [];

  for (const module of modules) {
    if (module.usageCount > 1) {
      duplicates.push({
        path: module.path,
        occurrences: module.usageCount,
        chunks: module.chunks,
        wastedSize: module.size * (module.usageCount - 1),
      });
    }
  }

  return duplicates.sort((a, b) => b.wastedSize - a.wastedSize);
}

/**
 * Generate optimization suggestions
 */
function generateOptimizationSuggestions(
  chunks: IChunkInfo[],
  modules: IModuleInfo[],
  duplicates: IDuplicateModule[],
  options: IBundleAnalysisOptions
): any[] {
  const suggestions: any[] = [];
  const thresholds = options.thresholds || {
    warning: 250 * 1024, // 250KB
    error: 500 * 1024, // 500KB
    critical: 1024 * 1024, // 1MB
  };

  // Check for large chunks
  for (const chunk of chunks) {
    if (chunk.size > thresholds.critical) {
      suggestions.push({
        type: 'split',
        severity: 'critical',
        message: `Chunk "${chunk.name}" is very large (${formatBytes(chunk.size)})`,
        potentialSavings: chunk.size * 0.3,
        affected: [chunk.name],
        action: 'Consider splitting this chunk into smaller pieces using dynamic imports',
      });
    } else if (chunk.size > thresholds.error) {
      suggestions.push({
        type: 'split',
        severity: 'high',
        message: `Chunk "${chunk.name}" is large (${formatBytes(chunk.size)})`,
        potentialSavings: chunk.size * 0.2,
        affected: [chunk.name],
        action: 'Review chunk composition and consider code splitting',
      });
    }
  }

  // Check for duplicates
  for (const duplicate of duplicates.slice(0, 10)) {
    if (duplicate.wastedSize > 50 * 1024) {
      suggestions.push({
        type: 'dedupe',
        severity: duplicate.wastedSize > 200 * 1024 ? 'high' : 'medium',
        message: `Module "${duplicate.path}" is duplicated ${duplicate.occurrences} times`,
        potentialSavings: duplicate.wastedSize,
        affected: duplicate.chunks,
        action: 'Extract common dependencies into a shared chunk',
      });
    }
  }

  // Check for large modules that could be lazy loaded
  const largeModules = modules.filter((m) => m.size > 100 * 1024);
  for (const module of largeModules.slice(0, 5)) {
    suggestions.push({
      type: 'lazy',
      severity: 'medium',
      message: `Large module "${module.path}" (${formatBytes(module.size)})`,
      potentialSavings: module.size,
      affected: [module.path],
      action: 'Consider lazy loading this module if not needed immediately',
    });
  }

  return suggestions;
}

/**
 * Format bytes to human-readable string
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Calculate compression ratio
 */
export function calculateCompressionRatio(original: number, compressed: number): number {
  if (original === 0) return 0;
  return ((original - compressed) / original) * 100;
}
