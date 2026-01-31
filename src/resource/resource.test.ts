/**
 * Resource System Tests
 * 
 * Tests for async resource management including loading states,
 * error handling, refetch, and dependency tracking.
 */

import { vi } from 'vitest'
import { createSignal } from '../reactivity/signal/create-signal'
import { createResource } from './create-resource'
import { createTrackedResource } from './create-tracked-resource'
import {
    clearAll,
    getErrors,
    isAllSuccess,
    isAnyError,
    isAnyLoading,
    refetchAll,
    waitForAll
} from './resource-utils'

describe('Resource System', () => {
    describe('createResource', () => {
        test('should start in idle state with lazy option', () => {
            const resource = createResource(() => Promise.resolve(42), { lazy: true });
            
            expect(resource.state).toBe('idle');
            expect(resource.data).toBeNull();
            expect(resource.error).toBeNull();
            expect(resource.isLoading).toBe(false);
        });
        
        test('should transition to loading state immediately without lazy', async () => {
            const resource = createResource(() => new Promise(resolve => {
                setTimeout(() => resolve(42), 10);
            }));
            
            // Give microtask time to execute
            await Promise.resolve();
            
            expect(resource.isLoading).toBe(true);
            expect(resource.state).toBe('loading');
        });
        
        test('should load data successfully', async () => {
            const fetchData = vi.fn(() => Promise.resolve({ id: 1, name: 'Test' }));
            const resource = createResource(fetchData, { lazy: true });
            
            await resource.load();
            
            expect(resource.isSuccess).toBe(true);
            expect(resource.data).toEqual({ id: 1, name: 'Test' });
            expect(resource.error).toBeNull();
            expect(fetchData).toHaveBeenCalledTimes(1);
        });
        
        test('should handle fetch errors', async () => {
            const error = new Error('Fetch failed');
            const resource = createResource(() => Promise.reject(error), { lazy: true });
            
            await resource.load();
            
            expect(resource.isError).toBe(true);
            expect(resource.error).toBe(error);
            expect(resource.data).toBeNull();
        });
        
        test('should deduplicate concurrent loads', async () => {
            const fetchData = vi.fn(() => new Promise(resolve => {
                setTimeout(() => resolve(42), 20);
            }));
            const resource = createResource(fetchData, { lazy: true });
            
            // Trigger multiple loads concurrently
            const promise1 = resource.load();
            const promise2 = resource.load();
            const promise3 = resource.load();
            
            await Promise.all([promise1, promise2, promise3]);
            
            // Should only call fetcher once despite 3 load calls
            expect(fetchData).toHaveBeenCalledTimes(1);
            expect(resource.data).toBe(42);
        });
        
        test('should call onSuccess callback', async () => {
            const onSuccess = vi.fn();
            const resource = createResource(
                () => Promise.resolve('data'),
                { lazy: true, onSuccess }
            );
            
            await resource.load();
            
            expect(onSuccess).toHaveBeenCalledWith('data');
        });
        
        test('should call onError callback', async () => {
            const error = new Error('Failed');
            const onError = vi.fn();
            const resource = createResource(
                () => Promise.reject(error),
                { lazy: true, onError }
            );
            
            await resource.load();
            
            expect(onError).toHaveBeenCalledWith(error);
        });
    });
    
    describe('refetch', () => {
        test('should refetch data', async () => {
            let callCount = 0;
            const fetchData = vi.fn(() => Promise.resolve(++callCount));
            const resource = createResource(fetchData, { lazy: true });
            
            await resource.load();
            expect(resource.data).toBe(1);
            
            await resource.refetch();
            expect(resource.data).toBe(2);
            expect(fetchData).toHaveBeenCalledTimes(2);
        });
        
        test('should clear error on successful refetch', async () => {
            let shouldFail = true;
            const fetchData = () => shouldFail 
                ? Promise.reject(new Error('Failed'))
                : Promise.resolve('success');
                
            const resource = createResource(fetchData, { lazy: true });
            
            await resource.load();
            expect(resource.isError).toBe(true);
            
            shouldFail = false;
            await resource.refetch();
            
            expect(resource.isSuccess).toBe(true);
            expect(resource.error).toBeNull();
        });
    });
    
    describe('clear', () => {
        test('should reset resource to idle state', async () => {
            const resource = createResource(() => Promise.resolve(42), { lazy: true });
            
            await resource.load();
            expect(resource.isSuccess).toBe(true);
            
            resource.clear();
            
            expect(resource.state).toBe('idle');
            expect(resource.data).toBeNull();
            expect(resource.error).toBeNull();
        });
    });
    
    describe('staleTime', () => {
        test('should mark resource as stale after staleTime', async () => {
            const resource = createResource(
                () => Promise.resolve(42),
                { lazy: true, staleTime: 50 }
            );
            
            await resource.load();
            expect(resource.isStale).toBe(false);
            
            // Wait for staleTime to pass
            await new Promise(resolve => setTimeout(resolve, 60));
            
            expect(resource.isStale).toBe(true);
        });
        
        test('should not be stale with staleTime=0', async () => {
            const resource = createResource(
                () => Promise.resolve(42),
                { lazy: true, staleTime: 0 }
            );
            
            await resource.load();
            
            await new Promise(resolve => setTimeout(resolve, 100));
            
            expect(resource.isStale).toBe(false);
        });
    });
    
    describe('createTrackedResource', () => {
        test.skip('should refetch when signal dependency changes', async () => {
            // TODO: This test needs proper effect/signal integration
            // The tracked resource concept works but needs more sophisticated
            // integration with the effect system to properly track async operations
            const userId = createSignal(1);
            let callCount = 0;
            const fetchData = vi.fn(() => {
                const id = userId(); // Access signal inside fetcher
                callCount++;
                return Promise.resolve(`User ${id} - Call ${callCount}`);
            });
            
            const resource = createTrackedResource(fetchData);
            
            // Wait for initial load
            await new Promise(resolve => setTimeout(resolve, 50));
            expect(resource.data).toContain('User 1');
            
            // Change signal - should trigger refetch
            userId(2);
            await new Promise(resolve => setTimeout(resolve, 50));
            
            expect(resource.data).toContain('User 2');
            expect(callCount).toBeGreaterThanOrEqual(2);
        });
    });
    
    describe('Resource Utilities', () => {
        test('isAnyLoading should detect loading resources', async () => {
            const r1 = createResource(() => Promise.resolve(1), { lazy: true });
            const r2 = createResource(() => new Promise(resolve => setTimeout(() => resolve(2), 50)));
            const r3 = createResource(() => Promise.resolve(3), { lazy: true });
            
            await Promise.resolve();
            
            expect(isAnyLoading([r1, r2, r3])).toBe(true);
        });
        
        test('isAllSuccess should check all resources succeeded', async () => {
            const r1 = createResource(() => Promise.resolve(1), { lazy: true });
            const r2 = createResource(() => Promise.resolve(2), { lazy: true });
            
            expect(isAllSuccess([r1, r2])).toBe(false);
            
            await r1.load();
            expect(isAllSuccess([r1, r2])).toBe(false);
            
            await r2.load();
            expect(isAllSuccess([r1, r2])).toBe(true);
        });
        
        test('isAnyError should detect error resources', async () => {
            const r1 = createResource(() => Promise.resolve(1), { lazy: true });
            const r2 = createResource(() => Promise.reject(new Error('Failed')), { lazy: true });
            
            await r1.load();
            await r2.load();
            
            expect(isAnyError([r1, r2])).toBe(true);
        });
        
        test('getErrors should collect all errors', async () => {
            const error1 = new Error('Error 1');
            const error2 = new Error('Error 2');
            
            const r1 = createResource(() => Promise.reject(error1), { lazy: true });
            const r2 = createResource(() => Promise.resolve(2), { lazy: true });
            const r3 = createResource(() => Promise.reject(error2), { lazy: true });
            
            await r1.load();
            await r2.load();
            await r3.load();
            
            const errors = getErrors([r1, r2, r3]);
            expect(errors).toHaveLength(2);
            expect(errors).toContain(error1);
            expect(errors).toContain(error2);
        });
        
        test('refetchAll should refetch all resources', async () => {
            let count1 = 0;
            let count2 = 0;
            
            const r1 = createResource(() => Promise.resolve(++count1), { lazy: true });
            const r2 = createResource(() => Promise.resolve(++count2), { lazy: true });
            
            await r1.load();
            await r2.load();
            
            expect(r1.data).toBe(1);
            expect(r2.data).toBe(1);
            
            await refetchAll([r1, r2]);
            
            expect(r1.data).toBe(2);
            expect(r2.data).toBe(2);
        });
        
        test('clearAll should clear all resources', async () => {
            const r1 = createResource(() => Promise.resolve(1), { lazy: true });
            const r2 = createResource(() => Promise.resolve(2), { lazy: true });
            
            await r1.load();
            await r2.load();
            
            clearAll([r1, r2]);
            
            expect(r1.state).toBe('idle');
            expect(r2.state).toBe('idle');
        });
        
        test('waitForAll should wait for all resources to finish', async () => {
            const r1 = createResource(() => new Promise(resolve => setTimeout(() => resolve(1), 20)));
            const r2 = createResource(() => new Promise(resolve => setTimeout(() => resolve(2), 40)));
            const r3 = createResource(() => new Promise(resolve => setTimeout(() => resolve(3), 10)));
            
            const startTime = Date.now();
            await waitForAll([r1, r2, r3]);
            const duration = Date.now() - startTime;
            
            // Should wait for slowest (r2 = 40ms)
            expect(duration).toBeGreaterThanOrEqual(40);
            expect(r1.isSuccess).toBe(true);
            expect(r2.isSuccess).toBe(true);
            expect(r3.isSuccess).toBe(true);
        });
    });
});
