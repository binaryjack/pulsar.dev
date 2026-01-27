/**
 * Global ApplicationRoot context
 * Provides access to the current ApplicationRoot from anywhere in the component tree
 */
import type { IApplicationRoot } from '../bootstrap';
/**
 * Set the current ApplicationRoot
 * Called by ApplicationRoot.mount()
 */
export declare function setCurrentAppRoot(appRoot: IApplicationRoot): void;
/**
 * Get the current ApplicationRoot
 * Returns null if no app is mounted
 */
export declare function getCurrentAppRoot(): IApplicationRoot | null;
/**
 * Clear the current ApplicationRoot
 * Called by ApplicationRoot.unmount()
 */
export declare function clearCurrentAppRoot(): void;
