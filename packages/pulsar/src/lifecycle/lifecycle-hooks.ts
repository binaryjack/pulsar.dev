import { LifecycleManager } from './lifecycle-manager/lifecycle-manager'
import { ILifecycleManager } from './lifecycle-manager/lifecycle-manager.types'

// Global lifecycle manager instance
let globalLifecycleManager: ILifecycleManager | null = null

/**
 * Gets the global lifecycle manager instance (creates if needed)
 */
function getLifecycleManager(): ILifecycleManager {
    if (!globalLifecycleManager) {
        globalLifecycleManager = new (LifecycleManager as unknown as new () => ILifecycleManager)()
    }
    return globalLifecycleManager
}

/**
 * Current element context for lifecycle hooks
 */
let currentElement: HTMLElement | null = null

/**
 * Sets the current element context
 */
export function setCurrentElement(element: HTMLElement | null): void {
    currentElement = element
}

/**
 * Gets the current element context
 */
export function getCurrentElement(): HTMLElement | null {
    return currentElement
}

/**
 * Hook to register a mount callback for the current element
 */
export function onMount(callback: () => void | (() => void)): void {
    if (!currentElement) {
        console.warn('onMount called outside of component context')
        return
    }
    
    const manager = getLifecycleManager()
    manager.onMount(currentElement, callback)
}

/**
 * Hook to register a cleanup callback for the current element
 */
export function onCleanup(callback: () => void): void {
    if (!currentElement) {
        console.warn('onCleanup called outside of component context')
        return
    }
    
    const manager = getLifecycleManager()
    manager.onCleanup(currentElement, callback)
}

/**
 * Hook to register an update callback for the current element
 */
export function onUpdate(callback: () => void | (() => void)): void {
    if (!currentElement) {
        console.warn('onUpdate called outside of component context')
        return
    }
    
    const manager = getLifecycleManager()
    manager.onUpdate(currentElement, callback)
}

/**
 * Utility to run mount callbacks for an element
 */
export function mount(element: HTMLElement): void {
    const manager = getLifecycleManager()
    manager.runMount(element)
}

/**
 * Utility to run cleanup callbacks for an element
 */
export function cleanup(element: HTMLElement): void {
    const manager = getLifecycleManager()
    manager.runCleanup(element)
}

/**
 * Utility to run update callbacks for an element
 */
export function update(element: HTMLElement): void {
    const manager = getLifecycleManager()
    manager.runUpdate(element)
}
