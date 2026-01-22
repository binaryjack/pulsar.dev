/**
 * formular.dev Testing Utilities
 *
 * Helper functions for testing Pulsar + formular.dev forms
 */

import { waitFor } from './async-utils';
import { fireEvent } from './events';

/**
 * Fill a form field with a value
 */
export function fillField(element: HTMLElement, value: string | boolean | number): void {
  if (element instanceof HTMLInputElement) {
    if (element.type === 'checkbox' || element.type === 'radio') {
      const targetChecked = Boolean(value);
      // Click only if the current state doesn't match the target
      // In JSDOM, click() toggles the checkbox automatically
      if (element.checked !== targetChecked) {
        fireEvent.click(element);
      }
    } else {
      fireEvent.change(element, String(value));
    }
  } else if (element instanceof HTMLTextAreaElement) {
    fireEvent.change(element, String(value));
  } else if (element instanceof HTMLSelectElement) {
    element.value = String(value);
    const event = new Event('change', { bubbles: true });
    fireEvent.dispatch(element, event);
  }
}

/**
 * Fill multiple form fields
 */
export function fillForm(fields: Record<string, string | boolean | number>): void {
  Object.entries(fields).forEach(([name, value]) => {
    const element = document.querySelector(`[name="${name}"]`) as HTMLElement;
    if (element) {
      fillField(element, value);
    }
  });
}

/**
 * Submit a form and wait for submission to complete
 */
export async function submitForm(
  form: HTMLFormElement,
  options: { waitForValidation?: boolean } = {}
): Promise<void> {
  const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
  form.dispatchEvent(submitEvent);

  if (options.waitForValidation) {
    await waitFor(() => {
      const isSubmitting = form.hasAttribute('data-submitting');
      if (isSubmitting) {
        throw new Error('Still submitting');
      }
    });
  }
}

/**
 * Get validation error for a field
 */
export function getFieldError(fieldName: string): string | null {
  const errorElement = document.querySelector(`[data-error-for="${fieldName}"]`);
  return errorElement ? errorElement.textContent : null;
}

/**
 * Check if field is valid
 */
export function isFieldValid(fieldName: string): boolean {
  const field = document.querySelector(`[name="${fieldName}"]`) as HTMLElement;
  if (!field) return false;

  return !field.hasAttribute('aria-invalid') || field.getAttribute('aria-invalid') === 'false';
}

/**
 * Check if field is touched
 */
export function isFieldTouched(fieldName: string): boolean {
  const field = document.querySelector(`[name="${fieldName}"]`) as HTMLElement;
  if (!field) return false;

  return field.hasAttribute('data-touched') && field.getAttribute('data-touched') === 'true';
}

/**
 * Check if field is dirty
 */
export function isFieldDirty(fieldName: string): boolean {
  const field = document.querySelector(`[name="${fieldName}"]`) as HTMLElement;
  if (!field) return false;

  return field.hasAttribute('data-dirty') && field.getAttribute('data-dirty') === 'true';
}

/**
 * Trigger field blur (marks as touched)
 */
export function blurField(fieldName: string): void {
  const field = document.querySelector(`[name="${fieldName}"]`) as HTMLElement;
  if (field) {
    fireEvent.blur(field);
  }
}

/**
 * Wait for field validation to complete
 */
export async function waitForFieldValidation(
  fieldName: string,
  timeout: number = 1000
): Promise<void> {
  await waitFor(
    () => {
      const field = document.querySelector(`[name="${fieldName}"]`) as HTMLElement;
      if (!field) {
        throw new Error(`Field "${fieldName}" not found`);
      }

      const isValidating =
        field.hasAttribute('data-validating') && field.getAttribute('data-validating') === 'true';

      if (isValidating) {
        throw new Error('Still validating');
      }
    },
    { timeout }
  );
}

/**
 * Wait for form submission to complete
 */
export async function waitForFormSubmission(
  form: HTMLFormElement,
  timeout: number = 5000
): Promise<void> {
  await waitFor(
    () => {
      const isSubmitting =
        form.hasAttribute('data-submitting') && form.getAttribute('data-submitting') === 'true';

      if (isSubmitting) {
        throw new Error('Still submitting');
      }
    },
    { timeout }
  );
}

/**
 * Get all form errors
 */
export function getFormErrors(): Record<string, string> {
  const errors: Record<string, string> = {};
  const errorElements = document.querySelectorAll('[data-error-for]');

  errorElements.forEach((el) => {
    const fieldName = el.getAttribute('data-error-for');
    const errorText = el.textContent;
    if (fieldName && errorText) {
      errors[fieldName] = errorText;
    }
  });

  return errors;
}

/**
 * Check if form is valid
 */
export function isFormValid(): boolean {
  const invalidFields = document.querySelectorAll('[aria-invalid="true"]');
  return invalidFields.length === 0;
}

/**
 * Check if form is submitting
 */
export function isFormSubmitting(): boolean {
  const form = document.querySelector('form');
  if (!form) return false;

  return form.hasAttribute('data-submitting') && form.getAttribute('data-submitting') === 'true';
}

/**
 * Mock formular.dev form for testing
 */
export interface IMockFormOptions<T> {
  initialValues: T;
  validators?: Record<string, string | ((value: any) => string | null)>;
  onSubmit?: (values: T) => void | Promise<void>;
}

/**
 * Create a mock form for testing
 */
export function createMockForm<T extends Record<string, any>>(
  options: IMockFormOptions<T>
): {
  values: T;
  errors: Record<string, string | null>;
  touched: Record<string, boolean>;
  dirty: Record<string, boolean>;
  isSubmitting: boolean;
  setValue: (field: keyof T, value: any) => void;
  setTouched: (field: keyof T, touched: boolean) => void;
  validate: (field?: keyof T) => Promise<boolean>;
  submit: () => Promise<void>;
  reset: () => void;
} {
  const state = {
    values: { ...options.initialValues },
    errors: {} as Record<string, string | null>,
    touched: {} as Record<string, boolean>,
    dirty: {} as Record<string, boolean>,
    isSubmitting: false,
  };

  return {
    get values() {
      return state.values;
    },
    get errors() {
      return state.errors;
    },
    get touched() {
      return state.touched;
    },
    get dirty() {
      return state.dirty;
    },
    get isSubmitting() {
      return state.isSubmitting;
    },
    setValue(field, value) {
      state.values[field as string] = value;
      state.dirty[field as string] = true;
    },
    setTouched(field, touched) {
      state.touched[field as string] = touched;
    },
    async validate(field) {
      if (field) {
        const validator = options.validators?.[field as string];
        if (validator) {
          const error =
            typeof validator === 'function' ? validator(state.values[field as string]) : null;
          state.errors[field as string] = error;
          return !error;
        }
      }
      return true;
    },
    async submit() {
      state.isSubmitting = true;
      try {
        await options.onSubmit?.(state.values);
      } finally {
        state.isSubmitting = false;
      }
    },
    reset() {
      state.values = { ...options.initialValues };
      state.errors = {};
      state.touched = {};
      state.dirty = {};
      state.isSubmitting = false;
    },
  };
}
