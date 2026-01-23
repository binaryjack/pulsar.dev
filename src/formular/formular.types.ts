/**
 * TypeScript interfaces for formular.dev + Pulsar integration
 */

/**
 * Field value signal with validation
 */
export interface IFormularField<T = any> {
  /** Get current field value */
  value: () => T;
  /** Get field error message */
  error: () => string | null;
  /** Is field touched (user interacted) */
  touched: () => boolean;
  /** Is field dirty (value changed from initial) */
  dirty: () => boolean;
  /** Is field validating (async) */
  validating: () => boolean;
  /** Set field value */
  setValue: (value: T) => void;
  /** Mark field as touched */
  setTouched: (touched: boolean) => void;
  /** Validate field manually */
  validate: () => Promise<boolean>;
  /** Reset field to initial value */
  reset: () => void;
}

/**
 * Field array operations
 */
export interface IFormularFieldArray<T = any> extends IFormularField<T[]> {
  /** Add item to array */
  push: (item: T) => void;
  /** Remove item at index */
  remove: (index: number) => void;
  /** Insert item at index */
  insert: (index: number, item: T) => void;
  /** Move item from index to another */
  move: (from: number, to: number) => void;
  /** Swap two items */
  swap: (indexA: number, indexB: number) => void;
  /** Get field at index */
  at: (index: number) => IFormularField<T>;
}

/**
 * Form fields (nested object of field signals)
 */
export type FormularFields<T> = {
  [K in keyof T]: T[K] extends Array<infer U>
    ? IFormularFieldArray<U>
    : T[K] extends object
      ? FormularFields<T[K]>
      : IFormularField<T[K]>;
};

/**
 * Validator function
 */
export type ValidatorFn<T = any> = (
  value: T,
  values?: any
) => string | null | Promise<string | null>;

/**
 * Validator map (field name -> validator string or function)
 */
export type ValidatorMap<T> = {
  [K in keyof T]?: string | ValidatorFn<T[K]> | Array<string | ValidatorFn<T[K]>>;
};

/**
 * Custom validator map
 */
export type CustomValidatorMap = Record<string, ValidatorFn>;

/**
 * Async validator map
 */
export type AsyncValidatorMap<T> = {
  [K in keyof T]?: (value: T[K], values: T) => Promise<string | null>;
};

/**
 * Form submission handler
 */
export type SubmitHandler<T> = (values: T) => void | Promise<void>;

/**
 * Form success handler
 */
export type SuccessHandler<T, R = any> = (response: R, values: T) => void;

/**
 * Form error handler
 */
export type ErrorHandler = (error: Error) => void;

/**
 * useFormular hook options
 */
export interface IFormularOptions<T> {
  /** Initial form values */
  initialValues: T;
  /** Field validators (string or function) */
  validators?: ValidatorMap<T>;
  /** Custom validator functions */
  customValidators?: CustomValidatorMap;
  /** Async validators */
  asyncValidators?: AsyncValidatorMap<T>;
  /** Validate on field change */
  validateOnChange?: boolean;
  /** Validate on field blur */
  validateOnBlur?: boolean;
  /** Validate on form mount */
  validateOnMount?: boolean;
  /** Submit handler */
  onSubmit?: SubmitHandler<T>;
  /** Success handler (after submit) */
  onSuccess?: SuccessHandler<T>;
  /** Error handler (on submit error) */
  onError?: ErrorHandler;
  /** Transform values before submit */
  transformValues?: (values: T) => any;
}

/**
 * Form-level state
 */
export interface IFormularState {
  /** Is form submitting */
  isSubmitting: () => boolean;
  /** Is form valid (all fields valid) */
  isValid: () => boolean;
  /** Is form dirty (any field changed) */
  isDirty: () => boolean;
  /** Is form touched (any field touched) */
  isTouched: () => boolean;
  /** Is form validating (any async validation) */
  isValidating: () => boolean;
  /** Form-level error */
  error: () => string | null;
  /** Number of submit attempts */
  submitCount: () => number;
}

/**
 * useFormular hook result
 */
export interface IFormularHook<T> extends IFormularState {
  /** Form fields (signal-based) */
  fields: FormularFields<T>;
  /** Get all form values */
  getValues: () => T;
  /** Set all form values */
  setValues: (values: Partial<T>) => void;
  /** Reset form to initial values */
  reset: () => void;
  /** Validate entire form */
  validate: () => Promise<boolean>;
  /** Handle form submit event */
  handleSubmit: (e?: Event) => Promise<void>;
  /** Submit form programmatically */
  submit: () => Promise<void>;
  /** Get field by path (e.g., 'user.profile.name') */
  getField: <K extends keyof T>(path: string) => IFormularField<T[K]> | null;
}

/**
 * Form context value
 */
export interface IFormularContext<T = any> {
  form: IFormularHook<T>;
}
