/**
 * ESLint Rule: no-uncalled-signal-prop
 *
 * Prevents passing signal functions instead of values to component props.
 * Signals must be called with () to get their current value.
 *
 * ❌ WRONG: <Header sidebarOpen={sidebarOpen} />
 * ✅ RIGHT: <Header sidebarOpen={sidebarOpen()} />
 */

import { Rule } from 'eslint';

export const noUncalledSignalProp: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Warn when signal functions are passed to component props instead of values',
      category: 'Signal Safety',
      recommended: true,
    },
    messages: {
      uncalledSignal:
        'Signal "{{name}}" passed to prop "{{prop}}" without calling it. Use {{name}}() instead of {{name}}.',
      possibleSignal:
        'Possible uncalled signal "{{name}}" passed to prop "{{prop}}". Verify this should be a function call.',
    },
    fixable: 'code',
  },

  create(context: Rule.RuleContext) {
    const signalVariables = new Set<string>();

    return {
      // Track signal declarations: const [state, setState] = signal()
      VariableDeclarator(node: any) {
        if (
          node.init?.callee?.name === 'signal' ||
          node.init?.callee?.name === 'useState' ||
          node.init?.callee?.name === 'createSignal'
        ) {
          if (node.id.type === 'Identifier') {
            signalVariables.add(node.id.name);
          } else if (node.id.type === 'ArrayPattern') {
            // const [state, setState] = signal()
            const firstElement = node.id.elements?.[0];
            if (firstElement?.type === 'Identifier') {
              signalVariables.add(firstElement.name);
            }
          }
        }
      },

      // Check JSX prop assignments
      JSXAttribute(node: any) {
        if (!node.value || node.value.type !== 'JSXExpressionContainer') {
          return;
        }

        const expression = node.value.expression;

        // Check if passing an identifier that looks like a signal
        if (expression.type === 'Identifier') {
          const varName = expression.name;

          if (signalVariables.has(varName)) {
            context.report({
              node,
              messageId: 'uncalledSignal',
              data: {
                name: varName,
                prop: node.name.name,
              },
              fix(fixer) {
                return fixer.replaceText(expression, `${varName}()`);
              },
            });
          }
        }

        // Check for common signal patterns
        if (
          expression.type === 'Identifier' &&
          (expression.name.startsWith('$') ||
            expression.name.startsWith('signal') ||
            expression.name.endsWith('Signal'))
        ) {
          context.report({
            node,
            messageId: 'possibleSignal',
            data: {
              name: expression.name,
              prop: node.name.name,
            },
          });
        }
      },
    };
  },
};
