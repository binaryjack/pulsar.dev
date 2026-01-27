/**
 * Register method for ElementRegistry
 * Registers an element with its metadata in the registry
 */
import type { IElementEntry } from '../../types';
import type { IElementRegistry } from '../element-registry.types';
export declare function register(this: IElementRegistry, id: string, element: HTMLElement, entry: IElementEntry): void;
