import { IEffect } from './effect.types'

// Global effect context for tracking
let currentEffect: IEffect | null = null
const effectStack: (IEffect | null)[] = []

/**
 * Get the currently executing effect
 */
export function getCurrentEffect(): IEffect | null {
    return currentEffect
}

/**
 * Set the current effect (used during execution)
 */
export function setCurrentEffect(effect: IEffect | null): void {
    currentEffect = effect
}

/**
 * Push current effect to stack
 */
export function pushEffect(effect: IEffect | null): void {
    effectStack.push(currentEffect)
    currentEffect = effect
}

/**
 * Pop effect from stack
 */
export function popEffect(): void {
    currentEffect = effectStack.pop() ?? null
}
