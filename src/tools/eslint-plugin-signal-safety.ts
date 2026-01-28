/**
 * ESLint Plugin for Pulsar Signal Safety
 *
 * Provides rules to catch common signal usage mistakes automatically:
 * - Passing signal functions instead of values to component props
 * - Using uncalled signals in conditions and callbacks
 * - Allowing signals to escape reactive contexts
 * - Attempting to mutate signals incorrectly
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
        'pulsar-signal-safety/no-uncalled-signal-prop': 'error',
        'pulsar-signal-safety/signal-in-condition': 'warn',
        'pulsar-signal-safety/no-signal-in-array': 'warn',
        'pulsar-signal-safety/no-signal-escape': 'warn',
        'pulsar-signal-safety/no-signal-in-callback': 'warn',
        'pulsar-signal-safety/signal-mutation-warning': 'warn',
      },
    },
    strict: {
      plugins: ['pulsar-signal-safety'],
      rules: {
        'pulsar-signal-safety/no-uncalled-signal-prop': 'error',
        'pulsar-signal-safety/signal-in-condition': 'error',
        'pulsar-signal-safety/no-signal-in-array': 'error',
        'pulsar-signal-safety/no-signal-escape': 'error',
        'pulsar-signal-safety/no-signal-in-callback': 'error',
        'pulsar-signal-safety/signal-mutation-warning': 'error',
      },
    },
  },
};

export default plugin;
