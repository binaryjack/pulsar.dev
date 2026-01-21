export const SLifecycleManager = Symbol.for('ILifecycleManager')

export type LifecycleCallback = () => void | (() => void)

export interface ILifecycleManager {
    // Constructor signature
    new (): ILifecycleManager
    
    // Internal state
    readonly mountCallbacks: WeakMap<HTMLElement, LifecycleCallback[]>
    readonly cleanupCallbacks: WeakMap<HTMLElement, (() => void)[]>
    readonly updateCallbacks: WeakMap<HTMLElement, LifecycleCallback[]>
    
    // Methods (defined in prototype)
    onMount: (element: HTMLElement, callback: LifecycleCallback) => void
    onCleanup: (element: HTMLElement, callback: () => void) => void
    onUpdate: (element: HTMLElement, callback: LifecycleCallback) => void
    runMount: (element: HTMLElement) => void
    runCleanup: (element: HTMLElement) => void
    runUpdate: (element: HTMLElement) => void
}
