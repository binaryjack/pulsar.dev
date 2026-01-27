/**
 * Data Serialization for SSR
 */
/**
 * Serialize data for client hydration
 */
export declare const serializeData: (data: any) => string;
/**
 * Deserialize data on the client
 */
export declare const deserializeData: <T = any>(str: string) => T;
/**
 * Create hydration script with serialized state
 */
export declare const createHydrationScript: (state: any) => string;
/**
 * Extract hydration state from DOM
 */
export declare const extractHydrationState: <T = any>() => T | null;
