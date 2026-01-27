import { SignalDependency } from '../../types';
import { IEffect } from '../effect.types';
/**
 * Adds a signal as a dependency of this effect
 */
export declare const addDependency: (this: IEffect, signal: SignalDependency) => void;
