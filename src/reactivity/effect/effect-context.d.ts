import { IEffect } from './effect.types';
/**
 * Get the currently executing effect
 */
export declare function getCurrentEffect(): IEffect | null;
/**
 * Set the current effect (used during execution)
 */
export declare function setCurrentEffect(effect: IEffect | null): void;
/**
 * Push current effect to stack
 */
export declare function pushEffect(effect: IEffect | null): void;
/**
 * Pop effect from stack
 */
export declare function popEffect(): void;
