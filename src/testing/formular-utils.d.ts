/**
 * formular.dev Testing Utilities
 *
 * Helper functions for testing Pulsar + formular.dev forms
 */
/**
 * Fill a form field with a value
 */
export declare function fillField(element: HTMLElement, value: string | boolean | number): void;
/**
 * Fill multiple form fields
 */
export declare function fillForm(fields: Record<string, string | boolean | number>): void;
/**
 * Submit a form and wait for submission to complete
 */
export declare function submitForm(form: HTMLFormElement, options?: {
    waitForValidation?: boolean;
}): Promise<void>;
/**
 * Get validation error for a field
 */
export declare function getFieldError(fieldName: string): string | null;
/**
 * Check if field is valid
 */
export declare function isFieldValid(fieldName: string): boolean;
/**
 * Check if field is touched
 */
export declare function isFieldTouched(fieldName: string): boolean;
/**
 * Check if field is dirty
 */
export declare function isFieldDirty(fieldName: string): boolean;
/**
 * Trigger field blur (marks as touched)
 */
export declare function blurField(fieldName: string): void;
/**
 * Wait for field validation to complete
 */
export declare function waitForFieldValidation(fieldName: string, timeout?: number): Promise<void>;
/**
 * Wait for form submission to complete
 */
export declare function waitForFormSubmission(form: HTMLFormElement, timeout?: number): Promise<void>;
/**
 * Get all form errors
 */
export declare function getFormErrors(): Record<string, string>;
/**
 * Check if form is valid
 */
export declare function isFormValid(): boolean;
/**
 * Check if form is submitting
 */
export declare function isFormSubmitting(): boolean;
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
export declare function createMockForm<T extends Record<string, any>>(options: IMockFormOptions<T>): {
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
};
