/**
 * Pulsar Signal Safety ESLint Rules
 *
 * Collection of rules to prevent common signal usage mistakes:
 * - Forgetting to call signals to get their values
 * - Passing signal functions to props expecting values
 * - Using uncalled signals in conditions and callbacks
 * - Allowing signals to escape reactive contexts
 * - Missing type annotations on component props
 * - Using "any" type in prop interfaces
 * - Not calling Accessor<T> props in JSX
 */

export { accessorMustBeCalled } from './accessor-must-be-called';
export { noAnyProps } from './no-any-props';
export { noSignalEscape } from './no-signal-escape';
export { noSignalInArray } from './no-signal-in-array';
export { noSignalInCallback } from './no-signal-in-callback';
export { noUncalledSignalProp } from './no-uncalled-signal-prop';
export { requireTypedProps } from './require-typed-props';
export { signalInCondition } from './signal-in-condition';
export { signalMutationWarning } from './signal-mutation-warning';

export const signalSafetyRules = {
  'no-uncalled-signal-prop': require('./no-uncalled-signal-prop').noUncalledSignalProp,
  'signal-in-condition': require('./signal-in-condition').signalInCondition,
  'no-signal-in-array': require('./no-signal-in-array').noSignalInArray,
  'no-signal-escape': require('./no-signal-escape').noSignalEscape,
  'no-signal-in-callback': require('./no-signal-in-callback').noSignalInCallback,
  'signal-mutation-warning': require('./signal-mutation-warning').signalMutationWarning,
  'require-typed-props': require('./require-typed-props').requireTypedProps,
  'no-any-props': require('./no-any-props').noAnyProps,
  'accessor-must-be-called': require('./accessor-must-be-called').accessorMustBeCalled,
};
