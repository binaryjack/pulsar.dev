/**
 * Parse hierarchical IDs back to components
 */

import { decodeBase36 } from './encode-base36';

/**
 * Parsed ID components
 */
export interface IParsedId {
  /** Generation number */
  generation: number;
  /** Parent ID (may be compound like "5.a.2") */
  parentId: string;
  /** Index in array (0 if not array item) */
  index: number;
  /** Fragment counter value */
  fragment: number;
  /** Original ID string */
  original: string;
}

/**
 * Parse hierarchical ID into components
 * @param id - Hierarchical ID string (e.g., "a.5.0.b")
 * @returns Parsed ID components
 * @throws Error if ID format is invalid
 */
export function parseId(id: string): IParsedId {
  if (!id || typeof id !== 'string') {
    throw new Error('ID must be a non-empty string');
  }

  const parts = id.split('.');

  if (parts.length < 4) {
    throw new Error(`Invalid ID format: "${id}" (expected at least 4 parts)`);
  }

  try {
    // First part: generation
    const generation = decodeBase36(parts[0]);

    // Second part: parent (may be "0" or a compound parent ID)
    const parentId = parts[1];

    // Third part: index
    const index = decodeBase36(parts[2]);

    // Fourth part: fragment
    const fragment = decodeBase36(parts[3]);

    return {
      generation,
      parentId,
      index,
      fragment,
      original: id,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to parse ID "${id}": ${error.message}`);
    }
    throw error;
  }
}

/**
 * Check if ID represents an array item (index !== 0)
 * @param id - ID string or parsed ID
 * @returns True if ID represents array item
 */
export function isArrayItemId(id: string | IParsedId): boolean {
  const parsed = typeof id === 'string' ? parseId(id) : id;
  return parsed.index !== 0;
}

/**
 * Extract parent ID from element ID
 * @param id - Element ID string
 * @returns Parent ID or null if root element
 */
export function getParentId(id: string): string | null {
  const parsed = parseId(id);
  return parsed.parentId === '0' ? null : parsed.parentId;
}

/**
 * Get generation number from ID
 * @param id - Element ID string
 * @returns Generation number
 */
export function getGeneration(id: string): number {
  const parsed = parseId(id);
  return parsed.generation;
}
