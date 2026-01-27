/**
 * Resource Load Method
 *
 * Executes the resource fetcher and updates state accordingly.
 * Handles loading state, success data, and error cases.
 */
import { IResourceInternal } from '../resource.types';
export declare const load: <T>(this: IResourceInternal<T>) => Promise<void>;
