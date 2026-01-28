/**
 * Testing Utilities - Main Export
 * Comprehensive testing framework for Pulsar
 */

// Rendering
export { cleanup, render, setupAutoCleanup } from './render';

// Events
export { blur, change, click, fireEvent, focus, keyboard, submit, type } from './events';

// Async utilities
export {
  act,
  flush,
  nextTick,
  wait,
  waitFor,
  waitForElement,
  waitForElementToBeRemoved,
  waitForStateUpdate,
} from './async-utils';

// Queries
export { createQueries, screen } from './queries';

// Mocks
export {
  createSpy,
  mockContext,
  mockFetch,
  mockLocalStorage,
  mockRouter,
  mockService,
  restoreAllMocks,
} from './mocks';

// formular.dev Testing Utilities
export {
  blurField,
  createMockForm,
  fillField,
  fillForm,
  getFieldError,
  getFormErrors,
  isFieldDirty,
  isFieldTouched,
  isFieldValid,
  isFormSubmitting,
  isFormValid,
  submitForm,
  waitForFieldValidation,
  waitForFormSubmission,
} from './formular-utils';

// Types
export type {
  IAccessibilityQueries,
  IFireEventOptions,
  IMockRouterOptions,
  IMockService,
  IQueryOptions,
  IRenderOptions,
  IRenderResult,
  IWaitForOptions,
  TCleanupFunction,
} from './testing.types';

// formular.dev types
export type { IMockFormOptions } from './formular-utils';

/**
 * Usage Example:
 *
 * ```typescript
 * import { render, screen, fireEvent, waitFor } from '@pulsar-framework/pulsar.dev/testing';
 *
 * describe('Counter', () => {
 *   it('increments on click', async () => {
 *     const { container } = render(Counter, { props: { initial: 0 } });
 *
 *     const button = screen.getByRole('button', { name: /increment/i });
 *     fireEvent.click(button);
 *
 *     await waitFor(() => {
 *       expect(screen.getByText('Count: 1')).toBeInTheDocument();
 *     });
 *   });
 * });
 * ```
 */
