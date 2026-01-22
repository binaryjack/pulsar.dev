/**
 * Event Utilities
 * Utilities for firing DOM events in tests
 */

import type { IFireEventOptions } from './testing.types';

/**
 * Fires a click event on an element
 */
export function click(element: HTMLElement, options?: IFireEventOptions): void {
  const event = new MouseEvent('click', {
    bubbles: options?.bubbles ?? true,
    cancelable: options?.cancelable ?? true,
    composed: options?.composed ?? true,
    view: window,
  });
  element.dispatchEvent(event);
}

/**
 * Fires a change event on an input element
 */
export function change(element: HTMLInputElement | HTMLTextAreaElement, value: string): void {
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    'value'
  )?.set;

  if (nativeInputValueSetter) {
    nativeInputValueSetter.call(element, value);
  } else {
    element.value = value;
  }

  const event = new Event('input', { bubbles: true });
  element.dispatchEvent(event);

  const changeEvent = new Event('change', { bubbles: true });
  element.dispatchEvent(changeEvent);
}

/**
 * Fires a focus event on an element
 */
export function focus(element: HTMLElement): void {
  element.focus();
  const event = new FocusEvent('focus', { bubbles: true });
  element.dispatchEvent(event);
}

/**
 * Fires a blur event on an element
 */
export function blur(element: HTMLElement): void {
  element.blur();
  const event = new FocusEvent('blur', { bubbles: true });
  element.dispatchEvent(event);
}

/**
 * Fires a keyboard event
 */
export function keyboard(
  element: HTMLElement,
  key: string,
  options?: { type?: 'keydown' | 'keyup' | 'keypress' } & IFireEventOptions
): void {
  const type = options?.type || 'keydown';
  const event = new KeyboardEvent(type, {
    key,
    bubbles: options?.bubbles ?? true,
    cancelable: options?.cancelable ?? true,
    composed: options?.composed ?? true,
  });
  element.dispatchEvent(event);
}

/**
 * Types text into an input element
 */
export function type(element: HTMLInputElement | HTMLTextAreaElement, text: string): void {
  focus(element);

  for (const char of text) {
    keyboard(element, char, { type: 'keydown' });
    keyboard(element, char, { type: 'keypress' });

    element.value += char;
    const inputEvent = new Event('input', { bubbles: true });
    element.dispatchEvent(inputEvent);

    keyboard(element, char, { type: 'keyup' });
  }

  blur(element);
}

/**
 * Fires a submit event on a form
 */
export function submit(form: HTMLFormElement): void {
  const event = new Event('submit', {
    bubbles: true,
    cancelable: true,
  });
  form.dispatchEvent(event);
}

/**
 * Main fireEvent API (similar to @testing-library)
 */
export const fireEvent = {
  click,
  change,
  focus,
  blur,
  keyboard,
  type,
  submit,

  /**
   * Generic event dispatcher
   */
  dispatch(element: HTMLElement, event: Event): void {
    element.dispatchEvent(event);
  },
};
