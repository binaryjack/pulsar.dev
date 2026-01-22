/**
 * HTTP Client Tests
 * Comprehensive test suite for HTTP client functionality
 */

import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { createHttpClient } from '../create-http-client';
import type { IHttpClient, IHttpError } from '../http-client.types';

// Mock fetch globally
const originalFetch = global.fetch;

describe('HTTP Client', () => {
  let client: IHttpClient;
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Create mock fetch
    mockFetch = vi.fn();
    global.fetch = mockFetch as unknown as typeof fetch;

    // Create client
    client = createHttpClient({
      baseURL: 'https://api.example.com',
      timeout: 5000,
    });
  });

  afterEach(() => {
    // Restore original fetch
    global.fetch = originalFetch;
    vi.clearAllMocks();
  });

  describe('GET requests', () => {
    test('makes a simple GET request', async () => {
      // Mock successful response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: async () => ({ id: 1, name: 'John' }),
      });

      const response = await client.get('/users/1');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/users/1',
        expect.objectContaining({
          method: 'GET',
        })
      );

      expect(response.status).toBe(200);
      expect(response.data).toEqual({ id: 1, name: 'John' });
      expect(response.fromCache).toBe(false);
    });

    test('includes query parameters', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: async () => [],
      });

      await client.get('/users', {
        params: { page: 1, limit: 10, active: true },
      });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/users?page=1&limit=10&active=true',
        expect.any(Object)
      );
    });
  });

  describe('POST requests', () => {
    test('sends JSON data', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        statusText: 'Created',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: async () => ({ id: 2, name: 'Jane' }),
      });

      const response = await client.post('/users', {
        name: 'Jane',
        email: 'jane@example.com',
      });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/users',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ name: 'Jane', email: 'jane@example.com' }),
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );

      expect(response.status).toBe(201);
      expect(response.data).toEqual({ id: 2, name: 'Jane' });
    });
  });

  describe('Error handling', () => {
    test('throws on HTTP errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: async () => ({ error: 'User not found' }),
      });

      await expect(client.get('/users/999')).rejects.toThrow('HTTP Error 404');
    });

    test('handles network errors', async () => {
      mockFetch.mockRejectedValueOnce(new TypeError('Network error'));

      await expect(client.get('/users')).rejects.toThrow('Network error');
    });

    test.skip('handles timeout', async () => {
      // Mock a request that never resolves
      mockFetch.mockImplementationOnce(() => new Promise(() => {}));

      const timeoutClient = createHttpClient({
        baseURL: 'https://api.example.com',
        timeout: 100,
      });

      try {
        await timeoutClient.get('/slow-endpoint');
      } catch (error) {
        const httpError = error as IHttpError;
        expect(httpError.isTimeout).toBe(true);
        expect(httpError.message).toContain('timeout');
      }
    });
  });

  describe('Caching', () => {
    test('caches GET responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: async () => ({ data: 'test' }),
      });

      // First request
      const response1 = await client.get('/data');
      expect(response1.fromCache).toBe(false);
      expect(mockFetch).toHaveBeenCalledTimes(1);

      // Second request (should use cache)
      const response2 = await client.get('/data');
      expect(response2.fromCache).toBe(true);
      expect(response2.data).toEqual({ data: 'test' });
      expect(mockFetch).toHaveBeenCalledTimes(1); // Still only 1 call
    });

    test('can clear cache', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: async () => ({ data: 'test' }),
      });

      // Make initial request
      await client.get('/data');
      expect(mockFetch).toHaveBeenCalledTimes(1);

      // Clear cache
      client.clearCache();

      // Next request should hit API again
      await client.get('/data');
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('Interceptors', () => {
    test('request interceptors can modify config', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: async () => ({}),
      });

      // Add interceptor to inject auth token
      client.addRequestInterceptor((config) => {
        return {
          ...config,
          headers: {
            ...config.headers,
            Authorization: 'Bearer test-token',
          },
        };
      });

      await client.get('/protected');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token',
          }),
        })
      );
    });

    test('response interceptors can transform data', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: async () => ({ user: { name: 'john' } }),
      });

      // Add interceptor to uppercase names
      client.addResponseInterceptor((response) => {
        if (response.data && typeof response.data === 'object' && 'user' in response.data) {
          const user = response.data.user as { name: string };
          return {
            ...response,
            data: {
              ...response.data,
              user: {
                ...user,
                name: user.name.toUpperCase(),
              },
            },
          };
        }
        return response;
      });

      const response = await client.get('/user');
      expect((response.data as { user: { name: string } }).user.name).toBe('JOHN');
    });
  });

  describe('Retry logic', () => {
    test('retries on 5xx errors', async () => {
      // First two calls fail, third succeeds
      mockFetch
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ error: 'Server error' }), {
            status: 500,
            statusText: 'Internal Server Error',
            headers: new Headers({ 'Content-Type': 'application/json' }),
          })
        )
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ error: 'Service unavailable' }), {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({ 'Content-Type': 'application/json' }),
          })
        )
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ success: true }), {
            status: 200,
            statusText: 'OK',
            headers: new Headers({ 'Content-Type': 'application/json' }),
          })
        );

      const response = await client.get('/unstable-endpoint', {
        retry: true,
        retryAttempts: 3,
        retryDelay: 10, // Short delay for testing
      });

      expect(mockFetch).toHaveBeenCalledTimes(3);
      expect(response.data).toEqual({ success: true });
    });

    test('does not retry on 4xx errors', async () => {
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ error: 'Not found' }), {
          status: 404,
          statusText: 'Not Found',
          headers: new Headers({ 'Content-Type': 'application/json' }),
        })
      );

      await expect(
        client.get('/missing', {
          retry: true,
          retryAttempts: 3,
        })
      ).rejects.toThrow('HTTP Error 404');

      expect(mockFetch).toHaveBeenCalledTimes(1); // No retries
    });
  });
});
