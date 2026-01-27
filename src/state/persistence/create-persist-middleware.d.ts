/**
 * createPersistMiddleware factory
 * Middleware for automatic state persistence
 */
import type { IPersistOptions, PersistMiddleware } from './persistence.types';
export declare function createPersistMiddleware<T extends Record<string, any>>(options: IPersistOptions<T>): PersistMiddleware<T>;
