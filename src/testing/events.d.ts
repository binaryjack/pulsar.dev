/**
 * Event Utilities
 * Utilities for firing DOM events in tests
 */
import type { IFireEventOptions } from './testing.types';
/**
 * Fires a click event on an element
 */
export declare function click(element: HTMLElement, options?: IFireEventOptions): void;
/**
 * Fires a change event on an input element
 */
export declare function change(element: HTMLInputElement | HTMLTextAreaElement, value: string): void;
/**
 * Fires a focus event on an element
 */
export declare function focus(element: HTMLElement): void;
/**
 * Fires a blur event on an element
 */
export declare function blur(element: HTMLElement): void;
/**
 * Fires a keyboard event
 */
export declare function keyboard(element: HTMLElement, key: string, options?: {
    type?: 'keydown' | 'keyup' | 'keypress';
} & IFireEventOptions): void;
/**
 * Types text into an input element
 */
export declare function type(element: HTMLInputElement | HTMLTextAreaElement, text: string): void;
/**
 * Fires a submit event on a form
 */
export declare function submit(form: HTMLFormElement): void;
/**
 * Main fireEvent API (similar to @testing-library)
 */
export declare const fireEvent: {
    click: typeof click;
    change: typeof change;
    focus: typeof focus;
    blur: typeof blur;
    keyboard: typeof keyboard;
    type: typeof type;
    submit: typeof submit;
    /**
     * Generic event dispatcher
     */
    dispatch(element: HTMLElement, event: Event): void;
};
