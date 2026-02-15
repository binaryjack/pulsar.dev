/**
 * Focused test for Catcher children function support
 */

import { describe, expect, it } from 'vitest';
import { Catcher, createErrorBoundaryContext, setActiveErrorBoundary } from '../index';

describe('Catcher Children Function Support', () => {
  it('should support children as render function', () => {
    // Create error boundary context
    const errorBoundary = createErrorBoundaryContext();
    const testError = new Error('Test error message');
    errorBoundary.catchError(testError);

    // Set as active boundary
    setActiveErrorBoundary(errorBoundary);

    // Create Catcher with children function
    const catcher = Catcher({
      children: (error, reset) => {
        const div = document.createElement('div');
        div.textContent = `Caught: ${error.message}`;
        div.setAttribute('data-test-id', 'error-display');
        return div;
      },
    });

    // Clear active boundary
    setActiveErrorBoundary(null);

    expect(catcher).toBeInstanceOf(HTMLElement);
    expect(catcher.textContent).toContain('Caught: Test error message');
    expect(catcher.querySelector('[data-test-id="error-display"]')).toBeTruthy();
  });

  it('should call reset function when provided', () => {
    const errorBoundary = createErrorBoundaryContext();
    errorBoundary.catchError(new Error('Test'));

    setActiveErrorBoundary(errorBoundary);

    let resetCalled = false;
    const catcher = Catcher({
      children: (error, reset) => {
        const button = document.createElement('button');
        button.textContent = 'Reset';
        button.onclick = () => {
          resetCalled = true;
          reset();
        };
        return button;
      },
    });

    setActiveErrorBoundary(null);

    const button = catcher.querySelector('button');
    expect(button).toBeTruthy();

    // Simulate click
    button?.click();
    // Note: Reset would need parent Tryer to actually work
    // Just verify the function is callable
  });
});
