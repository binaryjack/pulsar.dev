import { describe, expect, it, vi } from 'vitest';
import { useFormular } from '../use-formular';

describe('useFormular', () => {
  describe('Initialization', () => {
    it('should initialize with default values', () => {
      const form = useFormular({
        initialValues: {
          name: 'John',
          email: 'john@example.com',
          age: 30,
        },
      });

      expect(form.fields.name.value()).toBe('John');
      expect(form.fields.email.value()).toBe('john@example.com');
      expect(form.fields.age.value()).toBe(30);
    });

    it('should initialize state signals', () => {
      const form = useFormular({
        initialValues: { name: '' },
      });

      expect(form.isSubmitting()).toBe(false);
      expect(form.isValid()).toBe(true);
      expect(form.isDirty()).toBe(false);
      expect(form.isTouched()).toBe(false);
      expect(form.isValidating()).toBe(false);
      expect(form.error()).toBeNull();
      expect(form.submitCount()).toBe(0);
    });

    it('should initialize nested objects', () => {
      const form = useFormular({
        initialValues: {
          user: {
            profile: {
              name: 'John',
              age: 30,
            },
          },
        },
      });

      expect(form.fields.user.profile.name.value()).toBe('John');
      expect(form.fields.user.profile.age.value()).toBe(30);
    });

    it('should initialize arrays', () => {
      const form = useFormular({
        initialValues: {
          items: [1, 2, 3],
        },
      });

      expect(form.fields.items.value()).toEqual([1, 2, 3]);
    });
  });

  describe('Field updates', () => {
    it('should update field value', () => {
      const form = useFormular({
        initialValues: { name: 'John' },
      });

      form.fields.name.setValue('Jane');
      expect(form.fields.name.value()).toBe('Jane');
    });

    it('should mark field as dirty when value changes', () => {
      const form = useFormular({
        initialValues: { name: 'John' },
      });

      expect(form.fields.name.dirty()).toBe(false);
      form.fields.name.setValue('Jane');
      expect(form.fields.name.dirty()).toBe(true);
    });

    it('should not mark as dirty when set to same value', () => {
      const form = useFormular({
        initialValues: { name: 'John' },
      });

      form.fields.name.setValue('John');
      expect(form.fields.name.dirty()).toBe(false);
    });

    it('should mark field as touched', () => {
      const form = useFormular({
        initialValues: { name: 'John' },
      });

      expect(form.fields.name.touched()).toBe(false);
      form.fields.name.setTouched(true);
      expect(form.fields.name.touched()).toBe(true);
    });

    it('should update nested field values', () => {
      const form = useFormular({
        initialValues: {
          user: { name: 'John' },
        },
      });

      form.fields.user.name.setValue('Jane');
      expect(form.fields.user.name.value()).toBe('Jane');
    });
  });

  describe('Validation', () => {
    it('should validate required field', async () => {
      const form = useFormular({
        initialValues: { name: '' },
        validators: { name: 'required' },
      });

      const isValid = await form.fields.name.validate();
      expect(isValid).toBe(false);
      expect(form.fields.name.error()).toBe('This field is required');
    });

    it('should validate email field', async () => {
      const form = useFormular({
        initialValues: { email: 'invalid' },
        validators: { email: 'email' },
      });

      const isValid = await form.fields.email.validate();
      expect(isValid).toBe(false);
      expect(form.fields.email.error()).toBe('Invalid email address');
    });

    it('should validate with multiple rules', async () => {
      const form = useFormular({
        initialValues: { email: '' },
        validators: { email: 'required|email' },
      });

      const isValid = await form.fields.email.validate();
      expect(isValid).toBe(false);
      expect(form.fields.email.error()).toBe('This field is required');
    });

    it('should validate min rule', async () => {
      const form = useFormular({
        initialValues: { age: 10 },
        validators: { age: 'min:18' },
      });

      const isValid = await form.fields.age.validate();
      expect(isValid).toBe(false);
      expect(form.fields.age.error()).toBe('Must be at least 18');
    });

    it('should validate max rule', async () => {
      const form = useFormular({
        initialValues: { age: 100 },
        validators: { age: 'max:65' },
      });

      const isValid = await form.fields.age.validate();
      expect(isValid).toBe(false);
      expect(form.fields.age.error()).toBe('Must be at most 65');
    });

    it('should validate minLength rule', async () => {
      const form = useFormular({
        initialValues: { password: 'abc' },
        validators: { password: 'minLength:8' },
      });

      const isValid = await form.fields.password.validate();
      expect(isValid).toBe(false);
      expect(form.fields.password.error()).toBe('Must be at least 8 characters');
    });

    it('should validate maxLength rule', async () => {
      const form = useFormular({
        initialValues: { name: 'A'.repeat(51) },
        validators: { name: 'maxLength:50' },
      });

      const isValid = await form.fields.name.validate();
      expect(isValid).toBe(false);
      expect(form.fields.name.error()).toBe('Must be at most 50 characters');
    });

    it('should validate with custom validator function', async () => {
      const form = useFormular({
        initialValues: { username: 'ab' },
        validators: {
          username: (value: string) => {
            return value.length >= 3 ? null : 'Username too short';
          },
        },
      });

      const isValid = await form.fields.username.validate();
      expect(isValid).toBe(false);
      expect(form.fields.username.error()).toBe('Username too short');
    });

    it('should validate with custom validator name', async () => {
      const form = useFormular({
        initialValues: { password: 'weak' },
        validators: { password: 'strongPassword' },
        customValidators: {
          strongPassword: (value: string) => {
            const hasUpper = /[A-Z]/.test(value);
            const hasLower = /[a-z]/.test(value);
            const hasNumber = /\d/.test(value);
            const isLong = value.length >= 8;
            return hasUpper && hasLower && hasNumber && isLong ? null : 'Password must be strong';
          },
        },
      });

      const isValid = await form.fields.password.validate();
      expect(isValid).toBe(false);
      expect(form.fields.password.error()).toBe('Password must be strong');
    });

    it('should pass validation when valid', async () => {
      const form = useFormular({
        initialValues: { email: 'john@example.com' },
        validators: { email: 'required|email' },
      });

      const isValid = await form.fields.email.validate();
      expect(isValid).toBe(true);
      expect(form.fields.email.error()).toBeNull();
    });

    it('should validate entire form', async () => {
      const form = useFormular({
        initialValues: {
          name: '',
          email: 'invalid',
        },
        validators: {
          name: 'required',
          email: 'email',
        },
      });

      const isValid = await form.validate();
      expect(isValid).toBe(false);
      expect(form.isValid()).toBe(false);
    });

    it('should handle async validators', async () => {
      const form = useFormular({
        initialValues: { username: 'john' },
        asyncValidators: {
          username: async (value) => {
            await new Promise((resolve) => setTimeout(resolve, 10));
            return value === 'taken' ? 'Username already taken' : null;
          },
        },
      });

      expect(form.fields.username.validating()).toBe(false);
      const promise = form.fields.username.validate();
      expect(form.fields.username.validating()).toBe(true);

      const isValid = await promise;
      expect(isValid).toBe(true);
      expect(form.fields.username.validating()).toBe(false);
    });
  });

  describe('Form operations', () => {
    it('should get all form values', () => {
      const form = useFormular({
        initialValues: {
          name: 'John',
          email: 'john@example.com',
        },
      });

      const values = form.getValues();
      expect(values).toEqual({
        name: 'John',
        email: 'john@example.com',
      });
    });

    it('should set multiple values', () => {
      const form = useFormular({
        initialValues: {
          name: 'John',
          email: 'john@example.com',
        },
      });

      form.setValues({ name: 'Jane' });
      expect(form.fields.name.value()).toBe('Jane');
      expect(form.fields.email.value()).toBe('john@example.com');
    });

    it('should reset form to initial values', () => {
      const form = useFormular({
        initialValues: { name: 'John' },
      });

      form.fields.name.setValue('Jane');
      form.fields.name.setTouched(true);
      expect(form.fields.name.value()).toBe('Jane');
      expect(form.fields.name.touched()).toBe(true);
      expect(form.fields.name.dirty()).toBe(true);

      form.reset();
      expect(form.fields.name.value()).toBe('John');
      expect(form.fields.name.touched()).toBe(false);
      expect(form.fields.name.dirty()).toBe(false);
      expect(form.fields.name.error()).toBeNull();
    });

    it('should reset field individually', () => {
      const form = useFormular({
        initialValues: { name: 'John' },
      });

      form.fields.name.setValue('Jane');
      form.fields.name.reset();
      expect(form.fields.name.value()).toBe('John');
      expect(form.fields.name.dirty()).toBe(false);
    });
  });

  describe('Form submission', () => {
    it('should call onSubmit with form values', async () => {
      const onSubmit = vi.fn();
      const form = useFormular({
        initialValues: { name: 'John' },
        onSubmit,
      });

      await form.submit();
      expect(onSubmit).toHaveBeenCalledWith({ name: 'John' });
    });

    it('should set isSubmitting to false after submit', async () => {
      const form = useFormular({
        initialValues: { name: 'John' },
        onSubmit: async () => {
          await new Promise((resolve) => setTimeout(resolve, 10));
        },
      });

      expect(form.isSubmitting()).toBe(false);
      await form.submit();
      expect(form.isSubmitting()).toBe(false);
    });

    it('should validate before submit', async () => {
      const onSubmit = vi.fn();
      const form = useFormular({
        initialValues: { email: 'invalid' },
        validators: { email: 'email' },
        onSubmit,
      });

      await form.submit();
      expect(onSubmit).not.toHaveBeenCalled();
      expect(form.error()).toBe('Please fix validation errors');
    });

    it('should increment submit count', async () => {
      const form = useFormular({
        initialValues: { name: 'John' },
        onSubmit: async () => {},
      });

      expect(form.submitCount()).toBe(0);
      await form.submit();
      expect(form.submitCount()).toBe(1);
      await form.submit();
      expect(form.submitCount()).toBe(2);
    });

    it('should call onSuccess after successful submit', async () => {
      const onSuccess = vi.fn();
      const form = useFormular({
        initialValues: { name: 'John' },
        onSubmit: async () => ({ id: 1 }),
        onSuccess,
      });

      await form.submit();
      expect(onSuccess).toHaveBeenCalledWith({ id: 1 }, { name: 'John' });
    });

    it('should call onError on submit failure', async () => {
      const onError = vi.fn();
      const form = useFormular({
        initialValues: { name: 'John' },
        onSubmit: async () => {
          throw new Error('Submit failed');
        },
        onError,
      });

      await form.submit();
      expect(onError).toHaveBeenCalled();
      expect(form.error()).toBe('Submit failed');
    });

    it('should transform values before submit', async () => {
      const onSubmit = vi.fn();
      const form = useFormular({
        initialValues: { name: 'john' },
        transformValues: (values) => ({
          ...values,
          name: values.name.toUpperCase(),
        }),
        onSubmit,
      });

      await form.submit();
      expect(onSubmit).toHaveBeenCalledWith({ name: 'JOHN' });
    });

    it('should handle form submit event', async () => {
      const onSubmit = vi.fn();
      const form = useFormular({
        initialValues: { name: 'John' },
        onSubmit,
      });

      const event = new Event('submit');
      event.preventDefault = vi.fn();
      event.stopPropagation = vi.fn();

      await form.handleSubmit(event);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopPropagation).toHaveBeenCalled();
      expect(onSubmit).toHaveBeenCalled();
    });
  });

  describe('Field access', () => {
    it('should get field by path', () => {
      const form = useFormular({
        initialValues: {
          user: {
            profile: {
              name: 'John',
            },
          },
        },
      });

      const field = form.getField('user.profile.name');
      expect(field).toBeDefined();
      expect(field?.value()).toBe('John');
    });

    it('should return null for invalid path', () => {
      const form = useFormular({
        initialValues: { name: 'John' },
      });

      const field = form.getField('invalid.path');
      expect(field).toBeNull();
    });
  });

  describe('Edge cases', () => {
    it('should handle empty initial values', () => {
      const form = useFormular({
        initialValues: {},
      });

      expect(form.getValues()).toEqual({});
    });

    it('should handle null values', () => {
      const form = useFormular({
        initialValues: { value: null },
      });

      expect(form.fields.value.value()).toBeNull();
    });

    it('should handle undefined values', () => {
      const form = useFormular({
        initialValues: { value: undefined },
      });

      expect(form.fields.value.value()).toBeUndefined();
    });

    it('should handle boolean values', () => {
      const form = useFormular({
        initialValues: { accepted: false },
      });

      form.fields.accepted.setValue(true);
      expect(form.fields.accepted.value()).toBe(true);
    });

    it('should handle number zero', () => {
      const form = useFormular({
        initialValues: { count: 0 },
      });

      expect(form.fields.count.value()).toBe(0);
    });

    it('should handle empty string', () => {
      const form = useFormular({
        initialValues: { name: '' },
      });

      expect(form.fields.name.value()).toBe('');
    });
  });
});
