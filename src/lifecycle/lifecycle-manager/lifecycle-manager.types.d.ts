export declare const SLifecycleManager: unique symbol;
export type LifecycleCallback = () => void | (() => void);
export interface ILifecycleManager {
    new (): ILifecycleManager;
    readonly mountCallbacks: WeakMap<HTMLElement, LifecycleCallback[]>;
    readonly cleanupCallbacks: WeakMap<HTMLElement, (() => void)[]>;
    readonly updateCallbacks: WeakMap<HTMLElement, LifecycleCallback[]>;
    onMount: (element: HTMLElement, callback: LifecycleCallback) => void;
    onCleanup: (element: HTMLElement, callback: () => void) => void;
    onUpdate: (element: HTMLElement, callback: LifecycleCallback) => void;
    runMount: (element: HTMLElement) => void;
    runCleanup: (element: HTMLElement) => void;
    runUpdate: (element: HTMLElement) => void;
}
