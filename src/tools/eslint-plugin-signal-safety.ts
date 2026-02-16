/**
 * ESLint Plugin for Pulsar Signal Safety and Type Safety
 *
 * Provides rules to catch common signal usage mistakes and enforce type safety:
 * - Passing signal functions instead of values to component props
 * - Using uncalled signals in conditions and callbacks
 * - Allowing signals to escape reactive contexts
 * - Attempting to mutate signals incorrectly
 * - Missing or incorrect type annotations on component props
 * - Using "any" type in prop interfaces
 * - Not calling Accessor<T> props with ()
 *
 * All rules have automatic fixes available where applicable.
 */

import { signalSafetyRules } from './eslint-rules/index';

export const plugin = {
  rules: signalSafetyRules,
  configs: {
    recommended: {
      plugins: ['pulsar-signal-safety'],
      rules: {
        // Signal safety rules
        'pulsar-signal-safety/no-uncalled-signal-prop': 'error',
        'pulsar-signal-safety/signal-in-condition': 'warn',
        'pulsar-signal-safety/no-signal-in-array': 'warn',
        'pulsar-signal-safety/no-signal-escape': 'warn',
        'pulsar-signal-safety/no-signal-in-callback': 'warn',
        'pulsar-signal-safety/signal-mutation-warning': 'warn',

        // Type safety rules
        'pulsar-signal-safety/require-typed-props': 'error',
        'pulsar-signal-safety/no-any-props': 'error',
        'pulsar-signal-safety/accessor-must-be-called': 'error',
      },
    },
    strict: {
      plugins: ['pulsar-signal-safety'],
      rules: {
        // All signal safety rules as errors
        'pulsar-signal-safety/no-uncalled-signal-prop': 'error',
        'pulsar-signal-safety/signal-in-condition': 'error',
        'pulsar-signal-safety/no-signal-in-array': 'error',
        'pulsar-signal-safety/no-signal-escape': 'error',
        'pulsar-signal-safety/no-signal-in-callback': 'error',
        'pulsar-signal-safety/signal-mutation-warning': 'error',

        // All type safety rules as errors
        'pulsar-signal-safety/require-typed-props': 'error',
        'pulsar-signal-safety/no-any-props': 'error',
        'pulsar-signal-safety/accessor-must-be-called': 'error',
      },
    },
  },
};

export default plugin;
