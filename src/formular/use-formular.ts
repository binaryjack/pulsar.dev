/**
 * useFormular Hook
 *
 * Signal-based form management for Pulsar + formular.dev
 * Provides reactive form state with automatic validation and submission handling
 */

import { batch, createSignal } from '../reactivity';
import type {
  FormularFields,
  IFormularField,
  IFormularHook,
  IFormularOptions,
  ValidatorFn,
} from './formular.types';

/**
 * Deep clone object (simple version for form values)
 */
function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item)) as any;
  }
  const cloned: any = {};
  for (const key in obj) {
    cloned[key] = deepClone(obj[key]);
  }
  return cloned;
}

/**
 * Get nested property value by path
 */
function getByPath(obj: any, path: string): any {
  const keys = path.split('.');
  let value = obj;
  for (const key of keys) {
    value = value?.[key];
  }
  return value;
}

/**
 * Set nested property value by path
 */
function setByPath(obj: any, path: string, value: any): void {
  const keys = path.split('.');
  let target = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in target)) {
      target[key] = {};
    }
    target = target[key];
  }
  target[keys[keys.length - 1]] = value;
}

/**
 * Parse validator string to function
 * Supports: required, email, min:n, max:n, minLength:n, maxLength:n, pattern:regex
 */
function parseValidator(rule: string): ValidatorFn {
  const [name, param] = rule.split(':');

  switch (name.trim()) {
    case 'required':
      return (value) => {
        if (value === null || value === undefined || value === '') {
          return 'This field is required';
        }
        return null;
      };

    case 'email':
      return (value) => {
        if (!value) return null;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(String(value)) ? null : 'Invalid email address';
      };

    case 'min':
      return (value) => {
        if (!value) return null;
        const num = Number(value);
        const minNum = Number(param);
        return num >= minNum ? null : `Must be at least ${param}`;
      };

    case 'max':
      return (value) => {
        if (!value) return null;
        const num = Number(value);
        const maxNum = Number(param);
        return num <= maxNum ? null : `Must be at most ${param}`;
      };

    case 'minLength':
      return (value) => {
        if (!value) return null;
        const len = String(value).length;
        const minLen = Number(param);
        return len >= minLen ? null : `Must be at least ${param} characters`;
      };

    case 'maxLength':
      return (value) => {
        if (!value) return null;
        const len = String(value).length;
        const maxLen = Number(param);
        return len <= maxLen ? null : `Must be at most ${param} characters`;
      };

    case 'pattern':
      return (value) => {
        if (!value) return null;
        const regex = new RegExp(param);
        return regex.test(String(value)) ? null : 'Invalid format';
      };

    default:
      return () => null;
  }
}

/**
 * Create validator function from string, function, or array
 */
function createValidator<T>(
  validator: string | ValidatorFn<T> | Array<string | ValidatorFn<T>>,
  customValidators?: Record<string, ValidatorFn>
): ValidatorFn<T> {
  // Array of validators
  if (Array.isArray(validator)) {
    const validators = validator.map((v) => createValidator(v, customValidators));
    return async (value, values) => {
      for (const fn of validators) {
        const error = await fn(value, values);
        if (error) return error;
      }
      return null;
    };
  }

  // Function validator
  if (typeof validator === 'function') {
    return validator;
  }

  // String validator (pipe-separated rules)
  const rules = validator.split('|');
  const validators: ValidatorFn<T>[] = [];

  for (const rule of rules) {
    const trimmed = rule.trim();
    // Check custom validators first
    if (customValidators && trimmed in customValidators) {
      validators.push(customValidators[trimmed]);
    } else {
      validators.push(parseValidator(trimmed) as ValidatorFn<T>);
    }
  }

  return async (value, values) => {
    for (const fn of validators) {
      const error = await fn(value, values);
      if (error) return error;
    }
    return null;
  };
}

/**
 * Create a form field with signals
 */
function createFormField<T>(
  initialValue: T,
  validator?: ValidatorFn<T>,
  asyncValidator?: (value: T, values: any) => Promise<string | null>
): IFormularField<T> {
  const [value, setValue] = createSignal<T>(initialValue);
  const [error, setError] = createSignal<string | null>(null);
  const [touched, setTouched] = createSignal(false);
  const [dirty, setDirty] = createSignal(false);
  const [validating, setValidating] = createSignal(false);

  const validate = async (allValues?: any): Promise<boolean> => {
    if (!validator && !asyncValidator) {
      return true;
    }

    const currentValue = value();

    // Sync validation
    if (validator) {
      const syncError = await validator(currentValue, allValues);
      if (syncError) {
        setError(syncError);
        return false;
      }
    }

    // Async validation
    if (asyncValidator) {
      setValidating(true);
      try {
        const asyncError = await asyncValidator(currentValue, allValues);
        setError(asyncError);
        return asyncError === null;
      } finally {
        setValidating(false);
      }
    }

    setError(null);
    return true;
  };

  const handleSetValue = (newValue: T) => {
    setValue(newValue);
    setDirty(newValue !== initialValue);
  };

  const reset = () => {
    batch(() => {
      setValue(initialValue);
      setError(null);
      setTouched(false);
      setDirty(false);
      setValidating(false);
    });
  };

  return {
    value,
    error,
    touched,
    dirty,
    validating,
    setValue: handleSetValue,
    setTouched,
    validate,
    reset,
  };
}

/**
 * Create form fields recursively
 */
function createFormFields<T>(
  initialValues: T,
  validators: any = {},
  asyncValidators: any = {},
  customValidators?: Record<string, ValidatorFn>,
  path = ''
): FormularFields<T> {
  const fields: any = {};

  for (const key in initialValues) {
    const value = initialValues[key];
    const fieldPath = path ? `${path}.${key}` : key;
    const validator = validators[key]
      ? createValidator(validators[key], customValidators)
      : undefined;
    const asyncValidator = asyncValidators[key];

    if (Array.isArray(value)) {
      // Array field
      fields[key] = createFormField(value, validator, asyncValidator);
    } else if (value !== null && typeof value === 'object') {
      // Nested object
      fields[key] = createFormFields(
        value,
        validators[key] || {},
        asyncValidators[key] || {},
        customValidators,
        fieldPath
      );
    } else {
      // Primitive field
      fields[key] = createFormField(value, validator, asyncValidator);
    }
  }

  return fields as FormularFields<T>;
}

/**
 * Collect all field values from fields object
 */
function collectValues<T>(fields: FormularFields<T>): T {
  const values: any = {};

  for (const key in fields) {
    const field = fields[key] as any;

    if ('value' in field && typeof field.value === 'function') {
      // It's a field signal
      values[key] = field.value();
    } else {
      // It's a nested object
      values[key] = collectValues(field);
    }
  }

  return values;
}

/**
 * Validate all fields recursively
 */
async function validateAllFields<T>(fields: FormularFields<T>, values: T): Promise<boolean> {
  let isValid = true;

  for (const key in fields) {
    const field = fields[key] as any;

    if ('validate' in field && typeof field.validate === 'function') {
      const fieldValid = await field.validate(values);
      if (!fieldValid) isValid = false;
    } else {
      // Nested object
      const nestedValid = await validateAllFields(field, values);
      if (!nestedValid) isValid = false;
    }
  }

  return isValid;
}

/**
 * Reset all fields recursively
 */
function resetAllFields<T>(fields: FormularFields<T>): void {
  for (const key in fields) {
    const field = fields[key] as any;

    if ('reset' in field && typeof field.reset === 'function') {
      field.reset();
    } else {
      // Nested object
      resetAllFields(field);
    }
  }
}

/**
 * useFormular - Main hook for form management
 *
 * @param options - Form configuration
 * @returns Form hook with reactive fields and methods
 *
 * @example
 * const form = useFormular({
 *   initialValues: { name: '', email: '' },
 *   validators: { email: 'required|email' },
 *   onSubmit: async (values) => {
 *     await api.post('/users', values)
 *   }
 * })
 *
 * return (
 *   <form onSubmit={form.handleSubmit}>
 *     <input
 *       value={form.fields.name.value()}
 *       onInput={(e) => form.fields.name.setValue(e.target.value)}
 *     />
 *     <button type="submit">Submit</button>
 *   </form>
 * )
 */
export function useFormular<T extends Record<string, any>>(
  options: IFormularOptions<T>
): IFormularHook<T> {
  const {
    initialValues,
    validators = {},
    customValidators,
    asyncValidators = {},
    validateOnChange = false,
    validateOnBlur = true,
    validateOnMount = false,
    onSubmit,
    onSuccess,
    onError,
    transformValues,
  } = options;

  // Create form fields
  const fields = createFormFields(initialValues, validators, asyncValidators, customValidators);

  // Form-level state
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [isValid, setIsValid] = createSignal(true);
  const [isDirty, setIsDirty] = createSignal(false);
  const [isTouched, setIsTouched] = createSignal(false);
  const [isValidating, setIsValidating] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [submitCount, setSubmitCount] = createSignal(0);

  // Validate on mount if requested
  if (validateOnMount) {
    validateAllFields(fields, initialValues).then(setIsValid);
  }

  /**
   * Get all form values
   */
  const getValues = (): T => {
    return collectValues(fields);
  };

  /**
   * Set form values
   */
  const setValues = (values: Partial<T>): void => {
    batch(() => {
      for (const key in values) {
        const field = fields[key] as any;
        if (field && 'setValue' in field) {
          field.setValue(values[key]);
        }
      }
    });
  };

  /**
   * Reset form to initial values
   */
  const reset = (): void => {
    batch(() => {
      resetAllFields(fields);
      setIsSubmitting(false);
      setIsValid(true);
      setIsDirty(false);
      setIsTouched(false);
      setIsValidating(false);
      setError(null);
      setSubmitCount(0);
    });
  };

  /**
   * Validate entire form
   */
  const validate = async (): Promise<boolean> => {
    const values = getValues();
    const valid = await validateAllFields(fields, values);
    setIsValid(valid);
    return valid;
  };

  /**
   * Submit form
   */
  const submit = async (): Promise<void> => {
    if (!onSubmit) return;

    setSubmitCount(submitCount() + 1);

    // Validate before submit
    const valid = await validate();
    if (!valid) {
      setError('Please fix validation errors');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const values = getValues();
      const transformed = transformValues ? transformValues(values) : values;
      const result = await onSubmit(transformed);

      if (onSuccess) {
        onSuccess(result as any, values);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Submit failed';
      setError(errorMessage);

      if (onError) {
        onError(err instanceof Error ? err : new Error(errorMessage));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle form submit event
   */
  const handleSubmit = async (e?: Event): Promise<void> => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    await submit();
  };

  /**
   * Get field by path
   */
  const getField = <K extends keyof T>(path: string): IFormularField<T[K]> | null => {
    return getByPath(fields, path) || null;
  };

  return {
    fields,
    isSubmitting,
    isValid,
    isDirty,
    isTouched,
    isValidating,
    error,
    submitCount,
    getValues,
    setValues,
    reset,
    validate,
    handleSubmit,
    submit,
    getField,
  };
}
