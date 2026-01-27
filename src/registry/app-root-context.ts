/**
 * Global ApplicationRoot context
 * Provides access to the current ApplicationRoot from anywhere in the component tree
 */

import type { IApplicationRoot } from '../bootstrap';

let currentAppRoot: IApplicationRoot | null = null;

/**
 * Set the current ApplicationRoot
 * Called by ApplicationRoot.mount()
 */
export function setCurrentAppRoot(appRoot: IApplicationRoot): void {
  currentAppRoot = appRoot;
}

/**
 * Get the current ApplicationRoot
 * Returns null if no app is mounted
 */
export function getCurrentAppRoot(): IApplicationRoot | null {
  return currentAppRoot;
}

/**
 * Clear the current ApplicationRoot
 * Called by ApplicationRoot.unmount()
 */
export function clearCurrentAppRoot(): void {
  currentAppRoot = null;
}
