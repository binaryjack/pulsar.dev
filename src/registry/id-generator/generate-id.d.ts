/**
 * Hierarchical ID generation
 * Format: g.p.i.f (generation.parent.index.fragment)
 * Example: "a.5.0.b" = generation 10, parent 5, index 0, fragment 11
 */
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
export declare function generateId(context: IIdGenerationContext, parentId?: string, index?: number): string;
/**
 * Create a new ID generation context
 * @param generation - Starting generation number (default 0)
 * @returns New ID generation context
 */
export declare function createIdContext(generation?: number): IIdGenerationContext;
/**
 * Reset fragment counter (typically at start of render)
 * @param context - ID generation context to reset
 */
export declare function resetFragmentCounter(context: IIdGenerationContext): void;
/**
 * Increment generation (on app re-render)
 * @param context - ID generation context to increment
 */
export declare function incrementGeneration(context: IIdGenerationContext): void;
