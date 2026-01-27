import { IBatchManager } from '../batch.types';
/**
 * Schedule an effect to run after batch completes
 * If not batching, runs immediately
 */
export declare const schedule: (this: IBatchManager, effect: () => void) => void;
