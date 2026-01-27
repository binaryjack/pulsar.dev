import { IBatchManager } from '../batch.types';
/**
 * End a batch context
 * Decrements depth and flushes when reaching zero
 */
export declare const end: (this: IBatchManager) => void;
