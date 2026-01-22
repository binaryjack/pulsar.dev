import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
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
} from '../formular-utils';

describe('formular-utils', () => {
  // Clean DOM before each test to prevent test pollution
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('fillField', () => {
    it('should fill text input', () => {
      const input = document.createElement('input');
      input.type = 'text';
      document.body.appendChild(input);

      fillField(input, 'test value');

      expect(input.value).toBe('test value');
      document.body.removeChild(input);
    });

    it('should fill checkbox', () => {
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = false; // Start unchecked
      document.body.appendChild(checkbox);

      fillField(checkbox, true);

      expect(checkbox.checked).toBe(true);
      document.body.removeChild(checkbox);
    });

    it('should fill number input', () => {
      const input = document.createElement('input');
      input.type = 'number';
      document.body.appendChild(input);

      fillField(input, 42);

      expect(input.value).toBe('42');
      document.body.removeChild(input);
    });

    it('should fill textarea', () => {
      const textarea = document.createElement('textarea');
      document.body.appendChild(textarea);

      fillField(textarea, 'multi\nline\ntext');

      expect(textarea.value).toBe('multi\nline\ntext');
      document.body.removeChild(textarea);
    });

    it('should fill select', () => {
      const select = document.createElement('select');
      const option1 = document.createElement('option');
      option1.value = 'a';
      const option2 = document.createElement('option');
      option2.value = 'b';
      select.appendChild(option1);
      select.appendChild(option2);
      document.body.appendChild(select);

      fillField(select, 'b');

      expect(select.value).toBe('b');
      document.body.removeChild(select);
    });
  });

  describe('fillForm', () => {
    it('should fill multiple fields', () => {
      const input1 = document.createElement('input');
      input1.name = 'name';
      const input2 = document.createElement('input');
      input2.name = 'email';
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.name = 'terms';

      document.body.appendChild(input1);
      document.body.appendChild(input2);
      document.body.appendChild(checkbox);

      fillForm({
        name: 'John',
        email: 'john@example.com',
        terms: true,
      });

      expect(input1.value).toBe('John');
      expect(input2.value).toBe('john@example.com');
      expect(checkbox.checked).toBe(true);

      document.body.removeChild(input1);
      document.body.removeChild(input2);
      document.body.removeChild(checkbox);
    });
  });

  describe('getFieldError', () => {
    it('should get error text', () => {
      const error = document.createElement('span');
      error.setAttribute('data-error-for', 'email');
      error.textContent = 'Invalid email';
      document.body.appendChild(error);

      const errorText = getFieldError('email');

      expect(errorText).toBe('Invalid email');
      document.body.removeChild(error);
    });

    it('should return null if no error', () => {
      const errorText = getFieldError('nonexistent');
      expect(errorText).toBeNull();
    });
  });

  describe('isFieldValid', () => {
    it('should return true if field is valid', () => {
      const input = document.createElement('input');
      input.name = 'email';
      input.setAttribute('aria-invalid', 'false');
      document.body.appendChild(input);

      expect(isFieldValid('email')).toBe(true);
      document.body.removeChild(input);
    });

    it('should return false if field is invalid', () => {
      const input = document.createElement('input');
      input.name = 'email';
      input.setAttribute('aria-invalid', 'true');
      document.body.appendChild(input);

      expect(isFieldValid('email')).toBe(false);
      document.body.removeChild(input);
    });
  });

  describe('isFieldTouched', () => {
    it('should return true if field is touched', () => {
      const input = document.createElement('input');
      input.name = 'email';
      input.setAttribute('data-touched', 'true');
      document.body.appendChild(input);

      expect(isFieldTouched('email')).toBe(true);
      document.body.removeChild(input);
    });

    it('should return false if field is not touched', () => {
      const input = document.createElement('input');
      input.name = 'email';
      document.body.appendChild(input);

      expect(isFieldTouched('email')).toBe(false);
      document.body.removeChild(input);
    });
  });

  describe('isFieldDirty', () => {
    it('should return true if field is dirty', () => {
      const input = document.createElement('input');
      input.name = 'email';
      input.setAttribute('data-dirty', 'true');
      document.body.appendChild(input);

      expect(isFieldDirty('email')).toBe(true);
      document.body.removeChild(input);
    });

    it('should return false if field is not dirty', () => {
      const input = document.createElement('input');
      input.name = 'email';
      document.body.appendChild(input);

      expect(isFieldDirty('email')).toBe(false);
      document.body.removeChild(input);
    });
  });

  describe('getFormErrors', () => {
    it('should get all form errors', () => {
      const error1 = document.createElement('span');
      error1.setAttribute('data-error-for', 'email');
      error1.textContent = 'Invalid email';

      const error2 = document.createElement('span');
      error2.setAttribute('data-error-for', 'age');
      error2.textContent = 'Too young';

      document.body.appendChild(error1);
      document.body.appendChild(error2);

      const errors = getFormErrors();

      expect(errors).toEqual({
        email: 'Invalid email',
        age: 'Too young',
      });

      document.body.removeChild(error1);
      document.body.removeChild(error2);
    });
  });

  describe('isFormValid', () => {
    it('should return true if form has no invalid fields', () => {
      expect(isFormValid()).toBe(true);
    });

    it('should return false if form has invalid fields', () => {
      const input = document.createElement('input');
      input.setAttribute('aria-invalid', 'true');
      document.body.appendChild(input);

      expect(isFormValid()).toBe(false);
      document.body.removeChild(input);
    });
  });

  describe('isFormSubmitting', () => {
    it('should return true if form is submitting', () => {
      const form = document.createElement('form');
      form.setAttribute('data-submitting', 'true');
      document.body.appendChild(form);

      expect(isFormSubmitting()).toBe(true);
      document.body.removeChild(form);
    });

    it('should return false if form is not submitting', () => {
      const form = document.createElement('form');
      document.body.appendChild(form);

      expect(isFormSubmitting()).toBe(false);
      document.body.removeChild(form);
    });
  });

  describe('createMockForm', () => {
    it('should create mock form with initial values', () => {
      const form = createMockForm({
        initialValues: { name: 'John', email: '' },
      });

      expect(form.values).toEqual({ name: 'John', email: '' });
    });

    it('should track value changes', () => {
      const form = createMockForm({
        initialValues: { name: '', email: '' },
      });

      form.setValue('name', 'John');

      expect(form.values.name).toBe('John');
      expect(form.dirty.name).toBe(true);
    });

    it('should track touched state', () => {
      const form = createMockForm({
        initialValues: { email: '' },
      });

      form.setTouched('email', true);

      expect(form.touched.email).toBe(true);
    });

    it('should validate field with function', async () => {
      const form = createMockForm({
        initialValues: { email: '' },
        validators: {
          email: (value) => (value.includes('@') ? null : 'Invalid email'),
        },
      });

      form.setValue('email', 'invalid');
      const isValid = await form.validate('email');

      expect(isValid).toBe(false);
      expect(form.errors.email).toBe('Invalid email');
    });

    it('should call onSubmit', async () => {
      const onSubmit = vi.fn();
      const form = createMockForm({
        initialValues: { name: 'John' },
        onSubmit,
      });

      await form.submit();

      expect(onSubmit).toHaveBeenCalledWith({ name: 'John' });
      expect(form.isSubmitting).toBe(false);
    });

    it('should reset form', () => {
      const form = createMockForm({
        initialValues: { name: '', email: '' },
      });

      form.setValue('name', 'John');
      form.setTouched('email', true);
      form.errors.email = 'Error';

      form.reset();

      expect(form.values).toEqual({ name: '', email: '' });
      expect(form.dirty.name).toBeUndefined();
      expect(form.touched.email).toBeUndefined();
      expect(form.errors.email).toBeUndefined();
    });
  });
});
