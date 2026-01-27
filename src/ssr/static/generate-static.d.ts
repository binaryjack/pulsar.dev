/**
 * Static Site Generation
 */
import type { IStaticGenerationOptions } from '../ssr.types';
/**
 * Generate static HTML files for multiple routes
 */
export declare const generateStatic: (options: IStaticGenerationOptions) => Promise<void>;
