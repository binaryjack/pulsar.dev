/**
 * Query Utilities
 * DOM querying utilities with accessibility support
 */
import type { IAccessibilityQueries } from './testing.types';
/**
 * Creates query functions for a container
 */
export declare function createQueries(container: HTMLElement): IAccessibilityQueries;
/**
 * Global queries on document.body
 */
export declare const screen: IAccessibilityQueries;
