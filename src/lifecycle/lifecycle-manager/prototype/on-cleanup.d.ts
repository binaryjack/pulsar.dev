import { ILifecycleManager } from '../lifecycle-manager.types';
/**
 * Registers a cleanup callback to run when the element is removed from the DOM
 */
export declare const onCleanup: (this: ILifecycleManager, element: HTMLElement, callback: () => void) => void;
