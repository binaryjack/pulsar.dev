import { IMemo } from '../memo.types';
/**
 * Subscribes to memo changes
 */
export declare const subscribe: <T>(this: IMemo<T>, subscriber: () => void) => () => void;
