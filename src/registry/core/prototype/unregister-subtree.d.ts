/**
 * UnregisterSubtree method for ElementRegistry
 * Recursively unregisters an element and all its descendants
 */
import type { IElementRegistry } from '../element-registry.types';
export declare function unregisterSubtree(this: IElementRegistry, rootId: string): void;
