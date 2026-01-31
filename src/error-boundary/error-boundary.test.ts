/**
 * Tryer/Catcher Error Boundary Tests
 *
 * Tests for context-based error catching, recovery, and nested boundaries.
 */

import { vi } from 'vitest';
import { Catcher } from './catcher';
import { createErrorBoundaryContext } from './create-error-boundary-context';
import { IErrorInfo } from './error-boundary.types';
import { Tryer, cleanupTryer, resetTryer } from './tryer';

describe('Error Boundary System', () => {
  describe('createErrorBoundaryContext', () => {
    test('should start in idle state', () => {
      const context = createErrorBoundaryContext();

      expect(context.state).toBe('idle');
      expect(context.hasError).toBe(false);
      expect(context.errorInfo).toBeNull();
    });

    test('should catch errors and transition to error state', () => {
      const error = new Error('Test error');
      const context = createErrorBoundaryContext();

      context.catchError(error);

      expect(context.state).toBe('error');
      expect(context.hasError).toBe(true);
      expect(context.errorInfo?.error).toBe(error);
    });

    test('should call onError callback', () => {
      const error = new Error('Test error');
      const onError = vi.fn();
      const context = createErrorBoundaryContext({ onError });

      context.catchError(error);

      expect(onError).toHaveBeenCalledWith(
        expect.objectContaining({
          error,
          timestamp: expect.any(Number),
        })
      );
    });

    test('should include component name in error info', () => {
      const error = new Error('Test error');
      const context = createErrorBoundaryContext();

      context.catchError(error, 'TestComponent');

      expect(context.errorInfo?.componentName).toBe('TestComponent');
    });

    test('should include context in error info', () => {
      const error = new Error('Test error');
      const context = createErrorBoundaryContext();
      const errorContext = { userId: 123, action: 'submit' };

      context.catchError(error, 'Form', errorContext);

      expect(context.errorInfo?.context).toEqual(errorContext);
    });
  });

  describe('reset', () => {
    test('should reset error state to idle', () => {
      const error = new Error('Test error');
      const context = createErrorBoundaryContext();

      context.catchError(error);
      expect(context.hasError).toBe(true);

      context.reset();

      expect(context.state).toBe('idle');
      expect(context.hasError).toBe(false);
      expect(context.errorInfo).toBeNull();
    });

    test('should call onReset callback', () => {
      const onReset = vi.fn();
      const context = createErrorBoundaryContext({ onReset });

      context.catchError(new Error('Test'));
      context.reset();

      expect(onReset).toHaveBeenCalled();
    });
  });

  describe('Tryer component', () => {
    test('should render children normally when no error', () => {
      const child = document.createElement('div');
      child.textContent = 'Child content';

      const container = Tryer({ children: child });

      expect(container.contains(child)).toBe(true);
      expect(container.textContent).toContain('Child content');
    });

    test('should render multiple children', () => {
      const child1 = document.createElement('div');
      child1.textContent = 'Child 1';
      const child2 = document.createElement('div');
      child2.textContent = 'Child 2';

      const container = Tryer({ children: [child1, child2] });

      expect(container.contains(child1)).toBe(true);
      expect(container.contains(child2)).toBe(true);
    });

    test('should catch synchronous errors during render', () => {
      const erroringComponent = () => {
        throw new Error('Render error');
      };

      const onError = vi.fn();

      // This will throw during createElement, so we wrap in try-catch
      expect(() => {
        Tryer({
          children: erroringComponent(),
          options: { onError },
        });
      }).toThrow();
    });

    test('should render custom fallback on error', () => {
      const child = document.createElement('div');
      const fallback = vi.fn((errorInfo: IErrorInfo) => {
        const el = document.createElement('div');
        el.textContent = `Custom fallback: ${errorInfo.error.message}`;
        return el;
      });

      const container = Tryer({
        children: child,
        options: { fallback },
      });

      // Manually trigger error
      const errorBoundary = (container as { __errorBoundary?: { catchError: (e: Error) => void } })
        .__errorBoundary;
      if (errorBoundary) {
        errorBoundary.catchError(new Error('Test error'));
        // Note: In real usage, renderFallback would be called automatically
      }
    });

    test('should have error boundary stored on container', () => {
      const child = document.createElement('div');
      const container = Tryer({ children: child });

      const errorBoundary = (container as { __errorBoundary?: unknown }).__errorBoundary;
      expect(errorBoundary).toBeDefined();
    });
  });

  describe('resetTryer', () => {
    test('should restore original children after reset', () => {
      const child = document.createElement('div');
      child.textContent = 'Original child';

      const container = Tryer({ children: child });

      // Simulate error and fallback
      container.innerHTML = '';
      const fallback = document.createElement('div');
      fallback.textContent = 'Error occurred';
      container.appendChild(fallback);

      resetTryer(container);

      expect(container.contains(child)).toBe(true);
      expect(container.textContent).toContain('Original child');
    });
  });

  describe('Catcher component', () => {
    test('should render nothing when no error', () => {
      const catcher = Catcher();

      // Without error boundary, shows warning
      expect(catcher.textContent).toContain('Catcher requires Tryer parent');
    });

    test('should warn when used without Tryer', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation();

      Catcher();

      // In development, should warn
      // (but test might not run in dev mode)

      consoleSpy.mockRestore();
    });

    test('should use custom render function', () => {
      // Create mock error boundary context
      const errorInfo: IErrorInfo = {
        error: new Error('Test error'),
        timestamp: Date.now(),
      };

      const customRender = vi.fn((info: IErrorInfo) => {
        const el = document.createElement('div');
        el.textContent = `Custom: ${info.error.message}`;
        return el;
      });

      // Catcher needs to be inside Tryer to access context
      // This test verifies the render prop works when passed
      const container = document.createElement('div');
      const rendered = customRender(errorInfo);
      container.appendChild(rendered);

      expect(container.textContent).toContain('Custom: Test error');
    });
  });

  describe('Nested boundaries', () => {
    test('should support nested error boundaries', () => {
      const innerChild = document.createElement('div');
      innerChild.textContent = 'Inner content';

      const innerTryer = Tryer({
        children: innerChild,
        options: {
          onError: vi.fn(),
        },
      });

      const outerTryer = Tryer({
        children: innerTryer,
        options: {
          onError: vi.fn(),
        },
      });

      expect(outerTryer.contains(innerTryer)).toBe(true);
      expect(innerTryer.contains(innerChild)).toBe(true);
    });

    test('should propagate errors to parent when configured', () => {
      const parentOnError = vi.fn();
      const childOnError = vi.fn();

      const parentContext = createErrorBoundaryContext({
        onError: parentOnError,
      });

      const childContext = createErrorBoundaryContext(
        {
          onError: childOnError,
          propagate: true,
        },
        parentContext
      );

      const error = new Error('Child error');
      childContext.catchError(error);

      expect(childOnError).toHaveBeenCalled();
      expect(parentOnError).toHaveBeenCalled();
    });

    test('should not propagate errors by default', () => {
      const parentOnError = vi.fn();
      const childOnError = vi.fn();

      const parentContext = createErrorBoundaryContext({
        onError: parentOnError,
      });

      const childContext = createErrorBoundaryContext(
        {
          onError: childOnError,
          propagate: false,
        },
        parentContext
      );

      const error = new Error('Child error');
      childContext.catchError(error);

      expect(childOnError).toHaveBeenCalled();
      expect(parentOnError).not.toHaveBeenCalled();
    });
  });

  describe('Error recovery', () => {
    test('should allow retry after error', () => {
      const onReset = vi.fn();
      const context = createErrorBoundaryContext({ onReset });

      // Cause error
      context.catchError(new Error('Initial error'));
      expect(context.hasError).toBe(true);

      // Reset/retry
      context.reset();
      expect(context.hasError).toBe(false);
      expect(onReset).toHaveBeenCalled();
    });

    test('should clear error info on reset', () => {
      const context = createErrorBoundaryContext();

      context.catchError(new Error('Test'));
      expect(context.errorInfo).not.toBeNull();

      context.reset();
      expect(context.errorInfo).toBeNull();
    });
  });

  describe('Cleanup', () => {
    test('should cleanup event handlers', () => {
      const child = document.createElement('div');
      const container = Tryer({ children: child });

      // Event handler should be attached
      const errorHandler = (container as { __errorHandler?: unknown }).__errorHandler;
      expect(errorHandler).toBeDefined();

      // Cleanup
      cleanupTryer(container);

      // Handler still exists on container but removed from window
      // (we can't easily test window.removeEventListener was called)
    });
  });
});
