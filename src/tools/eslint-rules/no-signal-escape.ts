/**
 * ESLint Rule: no-signal-escape
 *
 * Prevents returning signal functions from functions or storing them in variables
 * that will be used outside of reactive contexts.
 *
 * ❌ WRONG:
 * function getValue() { return count }  // returns signal function
 * const value = getValue()  // now value is a function, not a number
 *
 * ✅ RIGHT:
 * function getValue() { return count() }  // returns the actual value
 * const value = getValue()  // value is a number
 */

import { Rule } from 'eslint';

export const noSignalEscape: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Warn when signal functions escape reactive contexts',
      category: 'Signal Safety',
      recommended: true,
    },
    messages: {
      escapedSignal:
        'Signal "{{name}}" returned without calling. This signal function will escape the reactive system. Use {{name}}() instead.',
      escapedAssignment:
        'Possible escaped signal "{{name}}" assigned without calling. Signals should be called to get their value.',
    },
    fixable: 'code',
  },

  create(context: Rule.RuleContext) {
    const signalVariables = new Set<string>();
    let functionDepth = 0;

    return {
      VariableDeclarator(node: any) {
        if (node.init?.callee?.name === 'signal' || node.init?.callee?.name === 'useState') {
          if (node.id.type === 'Identifier') {
            signalVariables.add(node.id.name);
          } else if (node.id.type === 'ArrayPattern') {
            const firstElement = node.id.elements?.[0];
            if (firstElement?.type === 'Identifier') {
              signalVariables.add(firstElement.name);
            }
          }
        }

        // Check assignments outside JSX
        if (node.init?.type === 'Identifier' && signalVariables.has(node.init.name)) {
          // Warn about assigning signal to variable
          context.report({
            node: node.init,
            messageId: 'escapedAssignment',
            data: { name: node.init.name },
          });
        }
      },

      FunctionDeclaration() {
        functionDepth++;
      },

      'FunctionDeclaration:exit'() {
        functionDepth--;
      },

      FunctionExpression() {
        functionDepth++;
      },

      'FunctionExpression:exit'() {
        functionDepth--;
      },

      ArrowFunctionExpression() {
        functionDepth++;
      },

      'ArrowFunctionExpression:exit'() {
        functionDepth--;
      },

      // Check return statements
      ReturnStatement(node: any) {
        if (functionDepth > 0 && node.argument?.type === 'Identifier') {
          const varName = node.argument.name;
          if (signalVariables.has(varName)) {
            context.report({
              node: node.argument,
              messageId: 'escapedSignal',
              data: { name: varName },
              fix(fixer) {
                return fixer.replaceText(node.argument, `${varName}()`);
              },
            });
          }
        }
      },

      // Check assignments outside JSX - already handled in first VariableDeclarator
      // (removed duplicate handler)
    };
  },
};
