/**
 * Element Registry interface
 * Tracks DOM elements and their metadata for surgical updates
 */
import type { IElementEntry, IElementMetadata } from '../types';
export interface IElementRegistry {
    /**
     * Constructor signature
     */
    new (): IElementRegistry;
    /**
     * Primary registry: ID -> Element entry
     */
    readonly registry: Map<string, IElementEntry>;
    /**
     * Metadata storage: Element -> Metadata (auto GC via WeakMap)
     */
    readonly metadata: WeakMap<HTMLElement, IElementMetadata>;
    /**
     * Parent-child tracking: Parent ID -> Set of child IDs
     */
    readonly parentChildren: Map<string, Set<string>>;
    /**
     * Register an element in the registry
     * @param id - Unique element ID
     * @param element - DOM element
     * @param entry - Element entry metadata
     * @throws Error if ID already exists
     */
    register(id: string, element: HTMLElement, entry: IElementEntry): void;
    /**
     * Unregister an element from the registry
     * @param id - Element ID to unregister
     */
    unregister(id: string): void;
    /**
     * Get element entry by ID
     * @param id - Element ID
     * @returns Element entry or undefined if not found
     */
    get(id: string): IElementEntry | undefined;
    /**
     * Check if element is registered
     * @param id - Element ID
     * @returns true if element exists in registry
     */
    has(id: string): boolean;
    /**
     * Get all child IDs of a parent element
     * @param parentId - Parent element ID
     * @returns Array of child element IDs
     */
    getChildren(parentId: string): string[];
    /**
     * Unregister an element and all its descendants
     * @param rootId - Root element ID
     */
    unregisterSubtree(rootId: string): void;
    /**
     * Clear entire registry
     */
    clear(): void;
    /**
     * Get registry size
     * @returns Number of registered elements
     */
    size(): number;
}
