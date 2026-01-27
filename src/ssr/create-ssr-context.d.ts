/**
 * SSR Context Creation
 */
import type { ISSRContext } from './ssr.types';
/**
 * Create an SSR context for server rendering
 */
export declare const createSSRContext: (options?: Partial<ISSRContext>) => ISSRContext;
