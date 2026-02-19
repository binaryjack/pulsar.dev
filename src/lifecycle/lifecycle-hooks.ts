import { registerCallback } from './context-bus';
import { LifecycleManager } from './lifecycle-manager/lifecycle-manager';
import { ILifecycleManager } from './lifecycle-manager/lifecycle-manager.types';

// Global lifecycle manager instance (for element-bound mount/update utilities)
let globalLifecycleManager: ILifecycleManager | null = null;

export function getLifecycleManager(): ILifecycleManager {
  if (!globalLifecycleManager) {
    globalLifecycleManager = new (LifecycleManager as unknown as new () => ILifecycleManager)();
  }
  return globalLifecycleManager;
}

/**
 * @deprecated Context is now managed via $REGISTRY._stack + context-bus.
 * Kept for backward compatibility - no-op.
 */
export function setCurrentElement(_element: HTMLElement | null): void {
  // no-op: context is managed via pushContext/popContext in execute.ts
}

/**
 * @deprecated Always returns null - context is now stack-based.
 */
export function getCurrentElement(): HTMLElement | null {
  return null;
}

/**
 * Hook to register a mount callback for the current component.
 * Must be called synchronously during component factory execution.
 */
export function onMount(callback: () => void | (() => void)): void {
  if (!registerCallback('mount', callback as () => void)) {
    console.warn('onMount called outside of component context');
  }
}

/**
 * Hook to register a cleanup callback for the current component.
 * The callback runs when the component's root element is disposed/removed from DOM.
 * Must be called synchronously during component factory execution.
 */
export function onCleanup(callback: () => void): void {
  if (!registerCallback('cleanup', callback)) {
    console.warn('onCleanup called outside of component context');
  }
}

/**
 * Hook to register an update callback for the current component.
 * Must be called synchronously during component factory execution.
 */
export function onUpdate(callback: () => void | (() => void)): void {
  if (!registerCallback('update', callback as () => void)) {
    console.warn('onUpdate called outside of component context');
  }
}

/**
 * Utility: run registered mount callbacks for an already-known element.
 */
export function mount(element: HTMLElement): void {
  getLifecycleManager().runMount(element);
}

/**
 * Utility: run registered cleanup callbacks for an already-known element.
 */
export function cleanup(element: HTMLElement): void {
  getLifecycleManager().runCleanup(element);
}

/**
 * Utility: run registered update callbacks for an already-known element.
 */
export function update(element: HTMLElement): void {
  getLifecycleManager().runUpdate(element);
}
