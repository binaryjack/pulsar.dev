import { ILifecycleManager } from '../lifecycle-manager.types';
/**
 * Runs all cleanup callbacks for an element and clears all lifecycle data
 */
export declare const runCleanup: (this: ILifecycleManager, element: HTMLElement) => void;
