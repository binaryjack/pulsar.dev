/**
 * ESLint Rule: signal-in-condition
 *
 * Prevents using signal functions in conditions without calling them.
 *
 * ❌ WRONG: if (isOpen) { ... }
 * ✅ RIGHT: if (isOpen()) { ... }
 */

import { Rule } from 'eslint';

export const signalInCondition: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Warn when signal functions are used in conditions without calling them',
      category: 'Signal Safety',
      recommended: true,
    },
    messages: {
      conditionSignal:
        'Signal "{{name}}" used in condition. Did you mean {{name}}() to get the value?',
    },
    fixable: 'code',
  },

  create(context: Rule.RuleContext) {
    const signalVariables = new Set<string>();

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
      },

      // Check ternary operators and logical conditions
      ConditionalExpression(node: any) {
        checkExpressionForSignal(node.test, signalVariables, context);
      },

      LogicalExpression(node: any) {
        checkExpressionForSignal(node.left, signalVariables, context);
        checkExpressionForSignal(node.right, signalVariables, context);
      },

      IfStatement(node: any) {
        checkExpressionForSignal(node.test, signalVariables, context);
      },
    };

    function checkExpressionForSignal(expr: any, signals: Set<string>, ctx: Rule.RuleContext) {
      if (expr.type === 'Identifier' && signals.has(expr.name)) {
        ctx.report({
          node: expr,
          messageId: 'conditionSignal',
          data: { name: expr.name },
          fix(fixer) {
            return fixer.replaceText(expr, `${expr.name}()`);
          },
        });
      }
    }
  },
};
