import { ILifecycleManager, LifecycleCallback } from '../lifecycle-manager.types';
/**
 * Registers a callback to run when the element is mounted to the DOM
 */
export declare const onMount: (this: ILifecycleManager, element: HTMLElement, callback: LifecycleCallback) => void;
