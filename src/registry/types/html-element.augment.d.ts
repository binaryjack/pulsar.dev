/**
 * HTMLElement type augmentation
 * Adds registry-specific properties to HTMLElement without needing type casts
 */
declare global {
    interface HTMLElement {
        /**
         * Element ID assigned by ElementRegistry
         * Used for O(1) lookup in event delegation and registry operations
         */
        __elementId?: string;
        /**
         * Parent element ID in the registry
         * Used for hierarchical tracking
         */
        __parentId?: string;
        /**
         * Flag indicating if element's key is its array index (anti-pattern warning)
         */
        __keyIsIndex?: boolean;
    }
}
export {};
