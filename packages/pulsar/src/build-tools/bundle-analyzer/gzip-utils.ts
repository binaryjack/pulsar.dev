/**
 * @fileoverview Gzip size calculation utilities
 * @module @pulsar/build-tools/bundle-analyzer
 */

/**
 * Calculate approximate gzip size
 * Note: This is a rough estimation. For accurate results, use actual gzip compression.
 */
export function gzipSize(content: string | Buffer): number {
  const text = typeof content === 'string' ? content : content.toString();

  // Rough approximation: gzipped size is typically 25-35% of original
  // This is a fallback when actual compression is not available
  const baseSize = Buffer.byteLength(text);

  // Calculate entropy-based estimate
  const entropy = calculateEntropy(text);
  const compressionRatio = 0.3 + entropy * 0.1; // 30-40% based on entropy

  return Math.round(baseSize * compressionRatio);
}

/**
 * Calculate Shannon entropy of text (0-1 range)
 * Higher entropy = more random = less compressible
 */
function calculateEntropy(text: string): number {
  const len = text.length;
  if (len === 0) return 0;

  const frequencies = new Map<string, number>();

  // Count character frequencies
  for (let i = 0; i < len; i++) {
    const char = text[i];
    frequencies.set(char, (frequencies.get(char) || 0) + 1);
  }

  // Calculate entropy
  let entropy = 0;
  for (const count of frequencies.values()) {
    const probability = count / len;
    entropy -= probability * Math.log2(probability);
  }

  // Normalize to 0-1 range (max entropy is log2(256) for bytes)
  return entropy / 8;
}

/**
 * Estimate gzip size for multiple files
 */
export function estimateTotalGzipSize(files: Array<{ content: string; size: number }>): number {
  let totalGzipped = 0;

  for (const file of files) {
    totalGzipped += gzipSize(file.content);
  }

  return totalGzipped;
}

/**
 * Check if content is compressible
 */
export function isCompressible(content: string): boolean {
  const entropy = calculateEntropy(content);
  // Content with entropy > 0.8 is not very compressible
  return entropy < 0.8;
}

/**
 * Estimate compression ratio for content
 */
export function estimateCompressionRatio(content: string): number {
  const originalSize = Buffer.byteLength(content);
  const gzippedSize = gzipSize(content);

  if (originalSize === 0) return 0;
  return ((originalSize - gzippedSize) / originalSize) * 100;
}
