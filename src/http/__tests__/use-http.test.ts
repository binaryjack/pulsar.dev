/**
 * Tests for useHttp hook
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createHttpClient } from '../create-http-client';
import type { IHttpClient } from '../http-client.types';
import { useHttp, useHttpGet, useHttpPost } from '../use-http';

describe('useHttp', () => {
  let client: IHttpClient;
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Create mock fetch
    mockFetch = vi.fn();
    globalThis.fetch = mockFetch;

    // Create client
    client = createHttpClient({
      baseURL: 'https://api.example.com',
      timeout: 5000,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic requests', () => {
    it('should initialize with null data and loading false', () => {
      const { data, loading, error, response } = useHttp(client, {
        url: '/users',
        method: 'GET',
      });

      expect(data()).toBeNull();
      expect(loading()).toBe(false);
      expect(error()).toBeNull();
      expect(response()).toBeNull();
    });

    it('should set loading to true when executing request', async () => {
      mockFetch.mockResolvedValue(
        new Response(JSON.stringify({ id: 1 }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        })
      );

      const { loading, execute } = useHttp(client, {
        url: '/users',
        method: 'GET',
      });

      expect(loading()).toBe(false);

      const promise = execute();

      // Loading should be true during request
      expect(loading()).toBe(true);

      await promise;

      // Loading should be false after request
      expect(loading()).toBe(false);
    });

    it('should update data signal on successful request', async () => {
      const mockData = { id: 1, name: 'John' };

      mockFetch.mockResolvedValue(
        new Response(JSON.stringify(mockData), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        })
      );

      const { data, loading, error, execute } = useHttp(client, {
        url: '/users/1',
        method: 'GET',
      });

      await execute();

      expect(data()).toEqual(mockData);
      expect(loading()).toBe(false);
      expect(error()).toBeNull();
    });

    it('should update response signal with full response', async () => {
      const mockData = { id: 1 };

      mockFetch.mockResolvedValue(
        new Response(JSON.stringify(mockData), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        })
      );

      const { response, execute } = useHttp(client, {
        url: '/users/1',
        method: 'GET',
      });

      await execute();

      const res = response();

      expect(res).not.toBeNull();
      expect(res!.status).toBe(200);
      expect(res!.data).toEqual(mockData);
      expect(res!.headers).toBeDefined();
      expect(typeof res!.headers).toBe('object');
    });

    it('should update error signal on failed request', async () => {
      mockFetch.mockResolvedValue(
        new Response(JSON.stringify({ message: 'Not Found' }), {
          status: 404,
        })
      );

      const { data, loading, error, execute } = useHttp(client, {
        url: '/users/999',
        method: 'GET',
      });

      try {
        await execute();
      } catch (err) {
        // Expected to throw
      }

      expect(data()).toBeNull();
      expect(loading()).toBe(false);
      expect(error()).not.toBeNull();
      expect(error()!.status).toBe(404);
    });
  });

  describe('execute() method', () => {
    it('should allow passing additional config to execute', async () => {
      mockFetch.mockResolvedValue(
        new Response(JSON.stringify({ id: 1 }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        })
      );

      const { execute } = useHttp(client, {
        url: '/users',
        method: 'GET',
      });

      await execute({ params: { page: 1 } });

      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('page=1'), expect.any(Object));
    });

    it('should merge additional config with initial config', async () => {
      mockFetch.mockResolvedValue(
        new Response(JSON.stringify({ id: 1 }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        })
      );

      const { execute } = useHttp(client, {
        url: '/users',
        method: 'GET',
        headers: { 'X-Custom': 'value' },
      });

      await execute({ headers: { 'X-Another': 'header' } });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-Custom': 'value',
            'X-Another': 'header',
          }),
        })
      );
    });
  });

  describe('refetch() method', () => {
    it('should refetch with last used configuration', async () => {
      mockFetch
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ id: 1 }), {
            status: 200,
            headers: { 'content-type': 'application/json' },
          })
        )
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ id: 2 }), {
            status: 200,
            headers: { 'content-type': 'application/json' },
          })
        );

      // Use client without caching for refetch tests
      const noCacheClient = createHttpClient({
        baseURL: 'https://api.example.com',
        cache: false,
      });

      const { data, execute, refetch } = useHttp(noCacheClient, {
        url: '/users',
        method: 'GET',
      });

      // Execute with additional config
      await execute({ params: { page: 1 } });

      expect(data()).toEqual({ id: 1 });

      // Refetch should use same config and get updated data
      await refetch();

      expect(data()).toEqual({ id: 2 });
    });

    it('should update signals on refetch', async () => {
      const mockData1 = { id: 1, name: 'John' };
      const mockData2 = { id: 1, name: 'John Updated' };

      mockFetch
        .mockResolvedValueOnce(
          new Response(JSON.stringify(mockData1), {
            status: 200,
            headers: { 'content-type': 'application/json' },
          })
        )
        .mockResolvedValueOnce(
          new Response(JSON.stringify(mockData2), {
            status: 200,
            headers: { 'content-type': 'application/json' },
          })
        );

      // Use client without caching for refetch tests
      const noCacheClient = createHttpClient({
        baseURL: 'https://api.example.com',
        cache: false,
      });

      const { data, execute, refetch } = useHttp(noCacheClient, {
        url: '/users/1',
        method: 'GET',
      });

      await execute();
      expect(data()).toEqual(mockData1);

      await refetch();
      expect(data()).toEqual(mockData2);
    });
  });

  describe('reset() method', () => {
    it('should reset all signals to initial state', async () => {
      mockFetch.mockResolvedValue(
        new Response(JSON.stringify({ id: 1 }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        })
      );

      const { data, loading, error, response, execute, reset } = useHttp(client, {
        url: '/users/1',
        method: 'GET',
      });

      // Execute request
      await execute();

      expect(data()).not.toBeNull();
      expect(response()).not.toBeNull();

      // Reset
      reset();

      expect(data()).toBeNull();
      expect(loading()).toBe(false);
      expect(error()).toBeNull();
      expect(response()).toBeNull();
    });
  });

  describe('Error handling', () => {
    it('should clear error on successful refetch', async () => {
      mockFetch
        .mockResolvedValueOnce(new Response('Not Found', { status: 404 }))
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ id: 1 }), {
            status: 200,
            headers: { 'content-type': 'application/json' },
          })
        );

      const { error, execute, refetch } = useHttp(client, {
        url: '/users/1',
        method: 'GET',
      });

      // First request fails
      try {
        await execute();
      } catch (err) {
        // Expected
      }

      expect(error()).not.toBeNull();

      // Refetch succeeds
      await refetch();

      expect(error()).toBeNull();
    });
  });
});

describe('useHttpGet', () => {
  let client: IHttpClient;
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockFetch = vi.fn();
    globalThis.fetch = mockFetch;

    client = createHttpClient({
      baseURL: 'https://api.example.com',
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create GET request hook', async () => {
    mockFetch.mockResolvedValue(
      new Response(JSON.stringify({ id: 1 }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      })
    );

    const { data, execute } = useHttpGet(client, '/users/1');

    await execute();

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.example.com/users/1',
      expect.objectContaining({
        method: 'GET',
      })
    );

    expect(data()).toEqual({ id: 1 });
  });

  it('should merge additional config', async () => {
    mockFetch.mockResolvedValue(
      new Response(JSON.stringify([]), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      })
    );

    const { execute } = useHttpGet(client, '/users', {
      params: { page: 1 },
    });

    await execute();

    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('page=1'), expect.any(Object));
  });
});

describe('useHttpPost', () => {
  let client: IHttpClient;
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockFetch = vi.fn();
    globalThis.fetch = mockFetch;

    client = createHttpClient({
      baseURL: 'https://api.example.com',
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create POST request hook', async () => {
    const newUser = { name: 'John' };

    mockFetch.mockResolvedValue(
      new Response(JSON.stringify({ id: 1, ...newUser }), {
        status: 201,
        headers: { 'content-type': 'application/json' },
      })
    );

    const { data, execute } = useHttpPost(client, '/users');

    await execute({ body: newUser });

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.example.com/users',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(newUser),
      })
    );

    expect(data()).toEqual({ id: 1, ...newUser });
  });
});
