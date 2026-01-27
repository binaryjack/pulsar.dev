/**
 * Sets the current element context
 */
export declare function setCurrentElement(element: HTMLElement | null): void;
/**
 * Gets the current element context
 */
export declare function getCurrentElement(): HTMLElement | null;
/**
 * Hook to register a mount callback for the current element
 */
export declare function onMount(callback: () => void | (() => void)): void;
/**
 * Hook to register a cleanup callback for the current element
 */
export declare function onCleanup(callback: () => void): void;
/**
 * Hook to register an update callback for the current element
 */
export declare function onUpdate(callback: () => void | (() => void)): void;
/**
 * Utility to run mount callbacks for an element
 */
export declare function mount(element: HTMLElement): void;
/**
 * Utility to run cleanup callbacks for an element
 */
export declare function cleanup(element: HTMLElement): void;
/**
 * Utility to run update callbacks for an element
 */
export declare function update(element: HTMLElement): void;
