/**
 * Mock Utilities
 * Utilities for mocking services, context, and router
 */
import type { IMockRouterOptions, IMockService } from './testing.types';
/**
 * Creates a mock service (simplified for testing)
 */
export declare function mockService<T>(token: string | symbol, implementation: T): IMockService<T>;
/**
 * Creates a spy function for testing
 */
export declare function createSpy<T extends (...args: any[]) => any>(implementation?: T): T & {
    calls: any[][];
    callCount: number;
    reset: () => void;
};
/**
 * Creates a mock context provider
 */
export declare function mockContext<T>(value: T): (children: HTMLElement) => HTMLElement;
/**
 * Creates a mock router for testing
 */
export declare function mockRouter(options?: IMockRouterOptions): IMockService<{
    readonly path: string;
    navigate(path: string): void;
    onNavigate(callback: (path: string) => void): () => void;
    routes: any[];
    reset(): void;
}>;
/**
 * Creates a mock fetch function
 */
export declare function mockFetch(responses: Record<string, any>): void;
/**
 * Creates a mock local storage
 */
export declare function mockLocalStorage(): Storage;
/**
 * Restores all mocks
 */
export declare function restoreAllMocks(): void;
