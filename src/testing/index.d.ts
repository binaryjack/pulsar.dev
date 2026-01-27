/**
 * Testing Utilities - Main Export
 * Comprehensive testing framework for Pulsar
 */
export { cleanup, render, setupAutoCleanup } from './render';
export { blur, change, click, fireEvent, focus, keyboard, submit, type } from './events';
export { act, flush, nextTick, wait, waitFor, waitForElement, waitForElementToBeRemoved, waitForStateUpdate, } from './async-utils';
export { createQueries, screen } from './queries';
export { createSpy, mockContext, mockFetch, mockLocalStorage, mockRouter, mockService, restoreAllMocks, } from './mocks';
export { blurField, createMockForm, fillField, fillForm, getFieldError, getFormErrors, isFieldDirty, isFieldTouched, isFieldValid, isFormSubmitting, isFormValid, submitForm, waitForFieldValidation, waitForFormSubmission, } from './formular-utils';
export type { IAccessibilityQueries, IFireEventOptions, IMockRouterOptions, IMockService, IQueryOptions, IRenderOptions, IRenderResult, IWaitForOptions, TCleanupFunction, } from './testing.types';
export type { IMockFormOptions } from './formular-utils';
/**
 * Usage Example:
 *
 * ```typescript
 * import { render, screen, fireEvent, waitFor } from 'pulsar/testing';
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
