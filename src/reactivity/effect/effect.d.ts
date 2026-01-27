import { IEffect } from './effect.types';
/**
 * Effect constructor function (prototype-based class)
 * Executes a function and automatically tracks signal dependencies
 */
export declare const Effect: {
    new (fn: () => void | (() => void)): IEffect;
};
