import { IBatchManager } from '../batch.types';
/**
 * Flush all pending effects
 * Executes each effect and clears the queue
 */
export declare const flush: (this: IBatchManager) => void;
