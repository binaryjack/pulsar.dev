import { describe, it, expect } from 'vitest';
import { createEnvSchema, string, boolean, number, oneOf, required, optional } from '../schema';

describe('Environment Schema Validation', () => {
  describe('string rule', () => {
    it('should validate string values', () => {
      const schema = createEnvSchema({
        TEST_VAR: string(),
      });

      const errors = schema.validate({ TEST_VAR: 'hello' });
      expect(errors).toHaveLength(0);
    });

    it('should fail for non-string values', () => {
      const schema = createEnvSchema({
        TEST_VAR: string(),
      });

      const errors = schema.validate({ TEST_VAR: 123 });
      expect(errors).toHaveLength(1);
      expect(errors[0].key).toBe('TEST_VAR');
    });

    it('should validate minLength', () => {
      const schema = createEnvSchema({
        TEST_VAR: string({ minLength: 3 }),
      });

      expect(schema.validate({ TEST_VAR: 'ab' })).toHaveLength(1);
      expect(schema.validate({ TEST_VAR: 'abc' })).toHaveLength(0);
    });

    it('should validate pattern', () => {
      const schema = createEnvSchema({
        EMAIL: string({ pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/ }),
      });

      expect(schema.validate({ EMAIL: 'invalid' })).toHaveLength(1);
      expect(schema.validate({ EMAIL: 'test@example.com' })).toHaveLength(0);
    });
  });

  describe('boolean rule', () => {
    it('should validate boolean values', () => {
      const schema = createEnvSchema({
        DEBUG: boolean(),
      });

      expect(schema.validate({ DEBUG: true })).toHaveLength(0);
      expect(schema.validate({ DEBUG: false })).toHaveLength(0);
    });

    it('should validate string boolean representations', () => {
      const schema = createEnvSchema({
        DEBUG: boolean(),
      });

      expect(schema.validate({ DEBUG: 'true' })).toHaveLength(0);
      expect(schema.validate({ DEBUG: 'false' })).toHaveLength(0);
      expect(schema.validate({ DEBUG: '1' })).toHaveLength(0);
      expect(schema.validate({ DEBUG: '0' })).toHaveLength(0);
      expect(schema.validate({ DEBUG: 'yes' })).toHaveLength(0);
      expect(schema.validate({ DEBUG: 'no' })).toHaveLength(0);
    });

    it('should fail for non-boolean values', () => {
      const schema = createEnvSchema({
        DEBUG: boolean(),
      });

      expect(schema.validate({ DEBUG: 'invalid' })).toHaveLength(1);
    });
  });

  describe('number rule', () => {
    it('should validate number values', () => {
      const schema = createEnvSchema({
        PORT: number(),
      });

      expect(schema.validate({ PORT: 3000 })).toHaveLength(0);
      expect(schema.validate({ PORT: '3000' })).toHaveLength(0);
    });

    it('should validate min/max', () => {
      const schema = createEnvSchema({
        PORT: number({ min: 1000, max: 9999 }),
      });

      expect(schema.validate({ PORT: 500 })).toHaveLength(1);
      expect(schema.validate({ PORT: 3000 })).toHaveLength(0);
      expect(schema.validate({ PORT: 10000 })).toHaveLength(1);
    });

    it('should validate integer', () => {
      const schema = createEnvSchema({
        COUNT: number({ integer: true }),
      });

      expect(schema.validate({ COUNT: 5 })).toHaveLength(0);
      expect(schema.validate({ COUNT: 5.5 })).toHaveLength(1);
    });
  });

  describe('oneOf rule', () => {
    it('should validate enum values', () => {
      const schema = createEnvSchema({
        NODE_ENV: oneOf(['development', 'production', 'test']),
      });

      expect(schema.validate({ NODE_ENV: 'development' })).toHaveLength(0);
      expect(schema.validate({ NODE_ENV: 'staging' })).toHaveLength(1);
    });
  });

  describe('required/optional', () => {
    it('should fail for missing required values', () => {
      const schema = createEnvSchema({
        API_KEY: required(string()),
      });

      const errors = schema.validate({});
      expect(errors).toHaveLength(1);
      expect(errors[0].key).toBe('API_KEY');
    });

    it('should pass for missing optional values', () => {
      const schema = createEnvSchema({
        DEBUG: optional(boolean()),
      });

      const errors = schema.validate({});
      expect(errors).toHaveLength(0);
    });
  });

  describe('validateOrThrow', () => {
    it('should throw on validation error', () => {
      const schema = createEnvSchema({
        NODE_ENV: required(oneOf(['development', 'production'])),
      });

      expect(() => schema.validateOrThrow({})).toThrow();
      expect(() => schema.validateOrThrow({ NODE_ENV: 'invalid' })).toThrow();
      expect(() => schema.validateOrThrow({ NODE_ENV: 'development' })).not.toThrow();
    });
  });

  describe('complex schema', () => {
    it('should validate multiple rules', () => {
      const schema = createEnvSchema({
        NODE_ENV: required(oneOf(['development', 'production', 'test'])),
        VITE_API_URL: required(string({ pattern: /^https?:\/\// })),
        VITE_API_TIMEOUT: optional(number({ min: 0 })),
        VITE_DEBUG: optional(boolean()),
      });

      const validEnv = {
        NODE_ENV: 'development',
        VITE_API_URL: 'http://localhost:3000',
        VITE_API_TIMEOUT: 5000,
        VITE_DEBUG: 'true',
      };

      expect(schema.validate(validEnv)).toHaveLength(0);

      const invalidEnv = {
        NODE_ENV: 'staging', // invalid
        VITE_API_URL: 'not-a-url', // invalid pattern
        VITE_API_TIMEOUT: -100, // below min
      };

      const errors = schema.validate(invalidEnv);
      expect(errors.length).toBeGreaterThan(0);
    });
  });
});
