import { IDevWarning } from './dev.types';
/**
 * Display a warning in development mode
 * Warnings are stripped in production builds
 *
 * @example
 * ```typescript
 * warn({
 *   message: 'Missing key prop',
 *   component: 'For',
 *   hint: 'Add a key function for better performance'
 * })
 * ```
 */
export declare function warn(warning: IDevWarning | string): void;
