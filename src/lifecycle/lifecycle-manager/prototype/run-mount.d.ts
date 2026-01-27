import { ILifecycleManager } from '../lifecycle-manager.types';
/**
 * Runs all mount callbacks for an element and stores any cleanup functions
 */
export declare const runMount: (this: ILifecycleManager, element: HTMLElement) => void;
