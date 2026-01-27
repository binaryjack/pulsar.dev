/**
 * Hierarchical ID generation
 * Format: g.p.i.f (generation.parent.index.fragment)
 * Example: "a.5.0.b" = generation 10, parent 5, index 0, fragment 11
 */

import { encodeBase36 } from './encode-base36';

/**
 * ID generation context
 */
export interface IIdGenerationContext {
  /** Current generation number (increments on full app re-render) */
  generation: number;
  /** Current parent element ID prefix (if any) */
  parentPrefix?: string;
  /** Auto-incrementing fragment counter for unique IDs */
  fragmentCounter: number;
}

/**
 * Generate hierarchical element ID
 * @param context - ID generation context
 * @param parentId - Optional parent element ID
 * @param index - Optional index for array items
 * @returns Hierarchical ID string (e.g., "a.5.0.b")
 */
export function generateId(
  context: IIdGenerationContext,
  parentId?: string,
  index?: number
): string {
  const parts: string[] = [];

  // Generation component
  parts.push(encodeBase36(context.generation));

  // Parent component (extract parent sequence or use 0)
  if (parentId) {
    // Use parent ID as-is (it's already encoded)
    parts.push(parentId);
  } else {
    parts.push('0');
  }

  // Index component (for array items)
  if (typeof index === 'number') {
    parts.push(encodeBase36(index));
  } else {
    parts.push('0');
  }

  // Fragment component (unique counter)
  const fragment = context.fragmentCounter++;
  parts.push(encodeBase36(fragment));

  return parts.join('.');
}

/**
 * Create a new ID generation context
 * @param generation - Starting generation number (default 0)
 * @returns New ID generation context
 */
export function createIdContext(generation = 0): IIdGenerationContext {
  return {
    generation,
    fragmentCounter: 0,
  };
}

/**
 * Reset fragment counter (typically at start of render)
 * @param context - ID generation context to reset
 */
export function resetFragmentCounter(context: IIdGenerationContext): void {
  context.fragmentCounter = 0;
}

/**
 * Increment generation (on app re-render)
 * @param context - ID generation context to increment
 */
export function incrementGeneration(context: IIdGenerationContext): void {
  context.generation++;
  context.fragmentCounter = 0;
}
