import { SignalDependency } from '../types';
export declare const SEffect: unique symbol;
export interface IEffect {
    new (fn: () => void | (() => void)): IEffect;
    readonly fn: () => void | (() => void);
    readonly dependencies: Set<SignalDependency>;
    readonly boundExecute: () => void;
    cleanupFn?: (() => void) | undefined;
    execute: () => void;
    addDependency: (signal: SignalDependency) => void;
    cleanup: () => void;
    dispose: () => void;
}
/**
 * Internal interface for writable effect properties
 */
export interface IEffectInternal extends IEffect {
    dependencies: Set<SignalDependency>;
    cleanupFn?: (() => void) | undefined;
}
