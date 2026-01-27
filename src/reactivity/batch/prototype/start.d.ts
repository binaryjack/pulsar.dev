import { IBatchManager } from '../batch.types';
/**
 * Start a batch context
 * Increments depth to support nested batches
 */
export declare const start: (this: IBatchManager) => void;
