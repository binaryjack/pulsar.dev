/**
 * Waiting Component Tests
 * 
 * Tests for Suspense-like Waiting component with loading fallbacks.
 */

import { Waiting, resolveWaiting, suspendWaiting } from './waiting'

describe('Waiting Component', () => {
    test('should initially render default (loading) content', () => {
        const loadingEl = document.createElement('div');
        loadingEl.textContent = 'Loading...';
        
        const contentEl = document.createElement('div');
        contentEl.textContent = 'Content';
        
        const container = Waiting({
            default: loadingEl,
            children: contentEl
        });
        
        expect(container.getAttribute('data-waiting')).toBe('true');
        expect(container.contains(loadingEl)).toBe(true);
        expect(container.contains(contentEl)).toBe(false);
    });
    
    test('should handle array of children', () => {
        const loadingEl = document.createElement('div');
        const child1 = document.createElement('div');
        const child2 = document.createElement('div');
        
        const container = Waiting({
            default: loadingEl,
            children: [child1, child2]
        });
        
        expect(container.contains(loadingEl)).toBe(true);
        expect(container.contains(child1)).toBe(false);
        expect(container.contains(child2)).toBe(false);
    });
    
    test('should store default and children for later transitions', () => {
        const loadingEl = document.createElement('div');
        const contentEl = document.createElement('div');
        
        const container = Waiting({
            default: loadingEl,
            children: contentEl
        });
        
        // Internal properties should be stored
        expect((container as never)['__waitingDefault']).toBe(loadingEl);
        expect((container as never)['__waitingChildren']).toEqual([contentEl]);
    });
    
    describe('resolveWaiting', () => {
        test('should transition from loading to content', () => {
            const loadingEl = document.createElement('div');
            loadingEl.textContent = 'Loading...';
            
            const contentEl = document.createElement('div');
            contentEl.textContent = 'Content';
            
            const container = Waiting({
                default: loadingEl,
                children: contentEl
            });
            
            resolveWaiting(container);
            
            expect(container.getAttribute('data-waiting')).toBeNull();
            expect(container.contains(loadingEl)).toBe(false);
            expect(container.contains(contentEl)).toBe(true);
        });
        
        test('should append all children when resolving', () => {
            const loadingEl = document.createElement('div');
            const child1 = document.createElement('div');
            child1.textContent = 'Child 1';
            const child2 = document.createElement('div');
            child2.textContent = 'Child 2';
            
            const container = Waiting({
                default: loadingEl,
                children: [child1, child2]
            });
            
            resolveWaiting(container);
            
            expect(container.contains(loadingEl)).toBe(false);
            expect(container.contains(child1)).toBe(true);
            expect(container.contains(child2)).toBe(true);
            expect(container.children.length).toBe(2);
        });
        
        test('should do nothing if called on non-Waiting container', () => {
            const regularDiv = document.createElement('div');
            regularDiv.textContent = 'Regular';
            
            expect(() => resolveWaiting(regularDiv)).not.toThrow();
            expect(regularDiv.textContent).toBe('Regular');
        });
    });
    
    describe('suspendWaiting', () => {
        test('should transition from content back to loading', () => {
            const loadingEl = document.createElement('div');
            loadingEl.textContent = 'Loading...';
            
            const contentEl = document.createElement('div');
            contentEl.textContent = 'Content';
            
            const container = Waiting({
                default: loadingEl,
                children: contentEl
            });
            
            // First resolve
            resolveWaiting(container);
            expect(container.contains(contentEl)).toBe(true);
            
            // Then suspend
            suspendWaiting(container);
            
            expect(container.getAttribute('data-waiting')).toBe('true');
            expect(container.contains(loadingEl)).toBe(true);
            expect(container.contains(contentEl)).toBe(false);
        });
        
        test('should remove all children when suspending', () => {
            const loadingEl = document.createElement('div');
            const child1 = document.createElement('div');
            const child2 = document.createElement('div');
            
            const container = Waiting({
                default: loadingEl,
                children: [child1, child2]
            });
            
            resolveWaiting(container);
            suspendWaiting(container);
            
            expect(container.contains(child1)).toBe(false);
            expect(container.contains(child2)).toBe(false);
            expect(container.contains(loadingEl)).toBe(true);
        });
        
        test('should do nothing if called on non-Waiting container', () => {
            const regularDiv = document.createElement('div');
            regularDiv.textContent = 'Regular';
            
            expect(() => suspendWaiting(regularDiv)).not.toThrow();
            expect(regularDiv.textContent).toBe('Regular');
        });
    });
    
    describe('Integration with Resources', () => {
        test('should work with resource loading lifecycle', () => {
            const loadingEl = document.createElement('div');
            loadingEl.textContent = 'Loading data...';
            
            const contentEl = document.createElement('div');
            contentEl.textContent = 'Data loaded!';
            
            const container = Waiting({
                default: loadingEl,
                children: contentEl
            });
            
            // Initially showing loading
            expect(container.textContent).toContain('Loading data...');
            
            // Simulate resource success
            resolveWaiting(container);
            expect(container.textContent).toContain('Data loaded!');
            
            // Simulate refetch (loading again)
            suspendWaiting(container);
            expect(container.textContent).toContain('Loading data...');
            
            // Success again
            resolveWaiting(container);
            expect(container.textContent).toContain('Data loaded!');
        });
    });
});
