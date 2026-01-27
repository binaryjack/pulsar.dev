/**
 * Portal Context Stack
 * Maintains logical parent chain for portal content
 * Allows portal children to access parent context even when rendered elsewhere
 */
/**
 * Context stack entry
 */
export interface IContextStackEntry {
    /** Element ID */
    elementId: string;
    /** Element reference */
    element: HTMLElement;
    /** Parent ID (logical hierarchy) */
    parentId?: string;
    /** Physical parent ID (actual DOM location) */
    physicalParentId?: string;
    /** Whether this is portal content */
    isPortal: boolean;
}
/**
 * Portal context stack
 * Tracks the logical parent chain for context propagation
 */
export interface IPortalContextStack {
    /** Context stack entries (oldest to newest) */
    readonly stack: IContextStackEntry[];
    /**
     * Push a context entry onto the stack
     */
    push(entry: IContextStackEntry): void;
    /**
     * Pop the most recent context entry
     */
    pop(): IContextStackEntry | undefined;
    /**
     * Get current context entry (top of stack)
     */
    current(): IContextStackEntry | undefined;
    /**
     * Get parent context entry
     */
    parent(): IContextStackEntry | undefined;
    /**
     * Find context entry by element ID
     */
    find(elementId: string): IContextStackEntry | undefined;
    /**
     * Get logical parent chain for element
     */
    getLogicalChain(elementId: string): IContextStackEntry[];
    /**
     * Clear the entire stack
     */
    clear(): void;
    /**
     * Get stack size
     */
    size(): number;
}
