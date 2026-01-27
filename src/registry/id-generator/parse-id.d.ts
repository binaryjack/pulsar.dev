/**
 * Parse hierarchical IDs back to components
 */
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
export declare function parseId(id: string): IParsedId;
/**
 * Check if ID represents an array item (index !== 0)
 * @param id - ID string or parsed ID
 * @returns True if ID represents array item
 */
export declare function isArrayItemId(id: string | IParsedId): boolean;
/**
 * Extract parent ID from element ID
 * @param id - Element ID string
 * @returns Parent ID or null if root element
 */
export declare function getParentId(id: string): string | null;
/**
 * Get generation number from ID
 * @param id - Element ID string
 * @returns Generation number
 */
export declare function getGeneration(id: string): number;
