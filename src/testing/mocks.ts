/**
 * Mock Utilities
 * Utilities for mocking services, context, and router
 */

import type { IMockRouterOptions, IMockService } from './testing.types';

// Global mock registry
const mockRegistry = new Map<string | symbol, any>();

/**
 * Creates a mock service (simplified for testing)
 */
export function mockService<T>(token: string | symbol, implementation: T): IMockService<T> {
  const originalService = mockRegistry.get(token);

  // Store mock
  mockRegistry.set(token, implementation);

  return {
    instance: implementation,
    restore: () => {
      if (originalService) {
        mockRegistry.set(token, originalService);
      } else {
        mockRegistry.delete(token);
      }
    },
  };
}

/**
 * Creates a spy function for testing
 */
export function createSpy<T extends (...args: any[]) => any>(
  implementation?: T
): T & { calls: any[][]; callCount: number; reset: () => void } {
  const calls: any[][] = [];

  const spy = ((...args: any[]) => {
    calls.push(args);
    return implementation ? implementation(...args) : undefined;
  }) as T & { calls: any[][]; callCount: number; reset: () => void };

  Object.defineProperty(spy, 'calls', {
    get: () => calls,
  });

  Object.defineProperty(spy, 'callCount', {
    get: () => calls.length,
  });

  spy.reset = () => {
    calls.length = 0;
  };

  return spy;
}

/**
 * Creates a mock context provider
 */
export function mockContext<T>(value: T): (children: HTMLElement) => HTMLElement {
  return (children: HTMLElement) => {
    // Store original context
    const originalContext = (globalThis as any).__PULSAR_CONTEXT__;
    (globalThis as any).__PULSAR_CONTEXT__ = value;

    // Restore on cleanup
    if (typeof afterEach !== 'undefined') {
      afterEach(() => {
        (globalThis as any).__PULSAR_CONTEXT__ = originalContext;
      });
    }

    return children;
  };
}

/**
 * Creates a mock router for testing
 */
export function mockRouter(options: IMockRouterOptions = {}) {
  const { initialPath = '/', routes = [] } = options;

  let currentPath = initialPath;
  const listeners: Array<(path: string) => void> = [];

  const router = {
    get path() {
      return currentPath;
    },

    navigate(path: string) {
      currentPath = path;
      listeners.forEach((fn) => fn(path));
    },

    onNavigate(callback: (path: string) => void) {
      listeners.push(callback);
      return () => {
        const index = listeners.indexOf(callback);
        if (index > -1) listeners.splice(index, 1);
      };
    },

    routes,

    reset() {
      currentPath = initialPath;
      listeners.length = 0;
    },
  };

  return mockService('router', router);
}

/**
 * Creates a mock fetch function
 */
export function mockFetch(responses: Record<string, any>): void {
  const originalFetch = global.fetch;

  (global as any).fetch = async (url: string, options?: RequestInit) => {
    const response = responses[url];

    if (!response) {
      throw new Error(`No mock response for: ${url}`);
    }

    return {
      ok: response.ok ?? true,
      status: response.status ?? 200,
      json: async () => response.data,
      text: async () => JSON.stringify(response.data),
      blob: async () => new Blob([JSON.stringify(response.data)]),
      arrayBuffer: async () => new ArrayBuffer(0),
      headers: new Headers(response.headers || {}),
      redirected: false,
      statusText: response.statusText || 'OK',
      type: 'basic' as ResponseType,
      url,
    } as Response;
  };

  // Restore on cleanup
  if (typeof afterEach !== 'undefined') {
    afterEach(() => {
      global.fetch = originalFetch;
    });
  }
}

/**
 * Creates a mock local storage
 */
export function mockLocalStorage(): Storage {
  const store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      Object.keys(store).forEach((key) => delete store[key]);
    },
    key: (index: number) => Object.keys(store)[index] || null,
    get length() {
      return Object.keys(store).length;
    },
  };
}

/**
 * Restores all mocks
 */
export function restoreAllMocks(): void {
  // This would be called in afterEach hooks
  mockRegistry.clear();
}
