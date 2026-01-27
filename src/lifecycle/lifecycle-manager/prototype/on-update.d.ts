import { ILifecycleManager, LifecycleCallback } from '../lifecycle-manager.types';
/**
 * Registers a callback to run when the element is updated
 */
export declare const onUpdate: (this: ILifecycleManager, element: HTMLElement, callback: LifecycleCallback) => void;
