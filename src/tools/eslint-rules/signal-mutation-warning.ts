/**
 * ESLint Rule: signal-mutation-warning
 *
 * Warns about common patterns that suggest unintended signal mutations.
 * Signals created with destructuring can't be reassigned; they need setter functions.
 *
 * ❌ WRONG:
 * const [count] = signal(0)
 * count = count + 1  // This doesn't work! count is a getter function
 *
 * ✅ RIGHT:
 * const [count, setCount] = signal(0)
 * setCount(count() + 1)  // Use the setter from destructuring
 */

import { Rule } from 'eslint';

export const signalMutationWarning: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Warn about patterns that suggest trying to mutate signals incorrectly',
      category: 'Signal Safety',
      recommended: true,
    },
    messages: {
      missingDestructor:
        'Signal declared but setter is not destructured. Use const [{{name}}, set{{Name}}] = signal(...) to get the setter.',
      reassignAttempt:
        'Cannot reassign signal "{{name}}". Signals from destructuring are read-only getters. Use the setter function instead.',
      directMutation:
        'Signal objects should not be mutated directly. Use the setter function from destructuring.',
    },
  },

  create(context: Rule.RuleContext) {
    const signalVariables = new Map<string, { hasOnlyOne: boolean; setterName?: string }>();

    return {
      VariableDeclarator(node: any) {
        if (node.init?.callee?.name === 'signal') {
          // Check if destructuring: const [state, setState] = signal()
          if (node.id.type === 'ArrayPattern') {
            const getter = node.id.elements?.[0];
            const setter = node.id.elements?.[1];

            if (getter?.type === 'Identifier') {
              const getterName = getter.name;
              const setterName = setter?.type === 'Identifier' ? setter.name : undefined;

              signalVariables.set(getterName, {
                hasOnlyOne: !setterName,
                setterName,
              });

              // Warn if only getter is destructured, not setter
              if (!setterName) {
                context.report({
                  node: getter,
                  messageId: 'missingDestructor',
                  data: {
                    name: getterName,
                    Name: getterName.charAt(0).toUpperCase() + getterName.slice(1),
                  },
                });
              }
            }
          } else if (node.id.type === 'Identifier') {
            // const signal = signal() - not destructured
            signalVariables.set(node.id.name, { hasOnlyOne: true });
          }
        }
      },

      // Check for reassignment attempts
      AssignmentExpression(node: any) {
        if (node.left.type === 'Identifier') {
          const varName = node.left.name;
          const info = signalVariables.get(varName);

          if (info?.hasOnlyOne) {
            context.report({
              node,
              messageId: 'reassignAttempt',
              data: { name: varName },
            });
          }
        }
      },

      // Check for property mutations on signals
      MemberExpression(node: any) {
        if (node.object?.type === 'Identifier' && signalVariables.has(node.object.name)) {
          const parent = context.sourceCode.getAncestors(node).pop();

          if (parent?.type === 'AssignmentExpression' && parent.left === node) {
            context.report({
              node,
              messageId: 'directMutation',
            });
          }
        }
      },
    };
  },
};
