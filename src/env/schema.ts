/**
 * Environment Variable Validation Schema
 * 
 * Minimal validation system for environment variables, inspired by formular.dev's
 * constraint builder pattern. Uses prototype-based classes following Pulsar conventions.
 * 
 * @example
 * ```typescript
 * import { createEnvSchema, required, oneOf, string } from 'pulsar/env/schema';
 * 
 * const schema = createEnvSchema({
 *   NODE_ENV: required(oneOf(['development', 'production', 'test'])),
 *   VITE_API_URL: required(string()),
 *   VITE_DEBUG: optional(boolean()),
 * });
 * 
 * const errors = schema.validate(env);
 * if (errors.length > 0) {
 *   console.error('Environment validation failed:', errors);
 * }
 * ```
 * 
 * @note
 * This is a lightweight implementation inspired by formular.dev's validation system.
 * For complex form validation, use formular.dev directly.
 */

/**
 * Validation error for environment variables
 */
export interface IEnvValidationError {
  /** Variable name that failed validation */
  key: string;
  /** Error message */
  message: string;
  /** Validation rule that failed */
  rule: string;
  /** Expected value/type */
  expected?: any;
  /** Actual value */
  actual?: any;
}

/**
 * Validation rule for a single environment variable
 */
export interface IEnvRule {
  /** Rule name/type */
  type: string;
  /** Is this variable required? */
  required: boolean;
  /** Validate the value */
  validate: (value: any) => boolean;
  /** Get error message */
  getError: (key: string, value: any) => string;
  /** Expected value description */
  expected?: any;
}

/**
 * Environment schema containing rules for multiple variables
 */
export interface IEnvSchema {
  /** Map of variable name to validation rule */
  rules: Record<string, IEnvRule>;
  
  /**
   * Validate environment object against schema
   * @param env - Environment object to validate
   * @returns Array of validation errors (empty if valid)
   */
  validate: (env: Record<string, any>) => IEnvValidationError[];
  
  /**
   * Validate and throw on first error
   * @param env - Environment object to validate
   * @throws Error if validation fails
   */
  validateOrThrow: (env: Record<string, any>) => void;
}

// ==================== RULE BUILDERS ====================

/**
 * String validation rule (prototype-based)
 * @param options - Validation options
 */
export interface IStringRuleOptions {
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
}

export const StringRule = function(this: IEnvRule, options: IStringRuleOptions = {}) {
  this.type = 'string';
  this.required = false;
  this.expected = 'string';
  
  this.validate = function(value: any): boolean {
    if (value === undefined || value === null) return !this.required;
    
    if (typeof value !== 'string') return false;
    
    if (options.minLength && value.length < options.minLength) return false;
    if (options.maxLength && value.length > options.maxLength) return false;
    if (options.pattern && !options.pattern.test(value)) return false;
    
    return true;
  };
  
  this.getError = function(key: string, value: any): string {
    if (value === undefined || value === null) {
      return `${key} is required but not defined`;
    }
    if (typeof value !== 'string') {
      return `${key} must be a string, got ${typeof value}`;
    }
    if (options.minLength && value.length < options.minLength) {
      return `${key} must be at least ${options.minLength} characters`;
    }
    if (options.maxLength && value.length > options.maxLength) {
      return `${key} must be at most ${options.maxLength} characters`;
    }
    if (options.pattern) {
      return `${key} must match pattern ${options.pattern}`;
    }
    return `${key} is invalid`;
  };
} as any as { new(options?: IStringRuleOptions): IEnvRule };

/**
 * Boolean validation rule (prototype-based)
 */
export const BooleanRule = function(this: IEnvRule) {
  this.type = 'boolean';
  this.required = false;
  this.expected = 'boolean';
  
  this.validate = function(value: any): boolean {
    if (value === undefined || value === null) return !this.required;
    
    if (typeof value === 'boolean') return true;
    if (typeof value === 'string') {
      const normalized = value.toLowerCase().trim();
      return ['true', 'false', '1', '0', 'yes', 'no', 'on', 'off'].includes(normalized);
    }
    
    return false;
  };
  
  this.getError = function(key: string, value: any): string {
    if (value === undefined || value === null) {
      return `${key} is required but not defined`;
    }
    return `${key} must be a boolean (true/false, 1/0, yes/no, on/off)`;
  };
} as any as { new(): IEnvRule };

/**
 * Number validation rule (prototype-based)
 */
export interface INumberRuleOptions {
  min?: number;
  max?: number;
  integer?: boolean;
}

export const NumberRule = function(this: IEnvRule, options: INumberRuleOptions = {}) {
  this.type = 'number';
  this.required = false;
  this.expected = 'number';
  
  this.validate = function(value: any): boolean {
    if (value === undefined || value === null) return !this.required;
    
    const num = typeof value === 'string' ? Number(value) : value;
    
    if (typeof num !== 'number' || isNaN(num)) return false;
    if (options.integer && !Number.isInteger(num)) return false;
    if (options.min !== undefined && num < options.min) return false;
    if (options.max !== undefined && num > options.max) return false;
    
    return true;
  };
  
  this.getError = function(key: string, value: any): string {
    if (value === undefined || value === null) {
      return `${key} is required but not defined`;
    }
    
    const num = typeof value === 'string' ? Number(value) : value;
    
    if (typeof num !== 'number' || isNaN(num)) {
      return `${key} must be a number`;
    }
    if (options.integer && !Number.isInteger(num)) {
      return `${key} must be an integer`;
    }
    if (options.min !== undefined && num < options.min) {
      return `${key} must be at least ${options.min}`;
    }
    if (options.max !== undefined && num > options.max) {
      return `${key} must be at most ${options.max}`;
    }
    
    return `${key} is invalid`;
  };
} as any as { new(options?: INumberRuleOptions): IEnvRule };

/**
 * OneOf/Enum validation rule (prototype-based)
 */
export const OneOfRule = function<T>(this: IEnvRule, allowedValues: T[]) {
  this.type = 'oneOf';
  this.required = false;
  this.expected = allowedValues;
  
  this.validate = function(value: any): boolean {
    if (value === undefined || value === null) return !this.required;
    return allowedValues.includes(value);
  };
  
  this.getError = function(key: string, value: any): string {
    if (value === undefined || value === null) {
      return `${key} is required but not defined`;
    }
    return `${key} must be one of: ${allowedValues.join(', ')}. Got: ${value}`;
  };
} as any as { new<T>(allowedValues: T[]): IEnvRule };

// ==================== HELPER FACTORIES ====================

/**
 * Create a string validation rule
 */
export function string(options?: IStringRuleOptions): IEnvRule {
  return new (StringRule as any)(options);
}

/**
 * Create a boolean validation rule
 */
export function boolean(): IEnvRule {
  return new (BooleanRule as any)();
}

/**
 * Create a number validation rule
 */
export function number(options?: INumberRuleOptions): IEnvRule {
  return new (NumberRule as any)(options);
}

/**
 * Create an enum/oneOf validation rule
 */
export function oneOf<T>(allowedValues: T[]): IEnvRule {
  return new (OneOfRule as any)(allowedValues);
}

/**
 * Mark a rule as required
 */
export function required(rule: IEnvRule): IEnvRule {
  rule.required = true;
  return rule;
}

/**
 * Mark a rule as optional (default)
 */
export function optional(rule: IEnvRule): IEnvRule {
  rule.required = false;
  return rule;
}

// ==================== SCHEMA ====================

/**
 * Environment Schema (prototype-based)
 */
export const EnvSchema = function(this: IEnvSchema, rules: Record<string, IEnvRule>) {
  this.rules = rules;
  
  this.validate = function(env: Record<string, any>): IEnvValidationError[] {
    const errors: IEnvValidationError[] = [];
    
    for (const [key, rule] of Object.entries(this.rules)) {
      const value = env[key];
      
      if (!rule.validate(value)) {
        errors.push({
          key,
          message: rule.getError(key, value),
          rule: rule.type,
          expected: rule.expected,
          actual: value,
        });
      }
    }
    
    return errors;
  };
  
  this.validateOrThrow = function(env: Record<string, any>): void {
    const errors = this.validate(env);
    
    if (errors.length > 0) {
      const errorMessages = errors.map(e => `  - ${e.message}`).join('\n');
      throw new Error(
        `Environment validation failed:\n${errorMessages}\n\n` +
        `Please check your .env file or environment variables.`
      );
    }
  };
} as any as { new(rules: Record<string, IEnvRule>): IEnvSchema };

/**
 * Create an environment validation schema
 * 
 * @example
 * ```typescript
 * const schema = createEnvSchema({
 *   NODE_ENV: required(oneOf(['development', 'production', 'test'])),
 *   VITE_API_URL: required(string()),
 *   VITE_API_TIMEOUT: optional(number({ min: 0 })),
 *   VITE_DEBUG: optional(boolean()),
 * });
 * 
 * // Validate
 * const errors = schema.validate(process.env);
 * 
 * // Or throw on error
 * schema.validateOrThrow(process.env);
 * ```
 */
export function createEnvSchema(rules: Record<string, IEnvRule>): IEnvSchema {
  return new (EnvSchema as any)(rules);
}
