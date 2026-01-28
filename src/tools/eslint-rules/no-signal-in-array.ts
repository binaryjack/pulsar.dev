/**
 * ESLint Rule: no-signal-in-array
 *
 * Prevents storing signal functions in arrays or objects without calling them first.
 * This is a common mistake when building dynamic component lists.
 *
 * ❌ WRONG: const items = [count, name, isActive]  // passes signal functions
 * ✅ RIGHT: const items = [count(), name(), isActive()]  // passes values
 */

import { Rule } from 'eslint';

export const noSignalInArray: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Warn when signal functions are stored in arrays or objects without calling them',
      category: 'Signal Safety',
      recommended: true,
    },
    messages: {
      signalInArray:
        'Signal "{{name}}" stored in array/object without calling. Use {{name}}() to get the value.',
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

      // Check array elements
      ArrayExpression(node: any) {
        node.elements.forEach((element: any) => {
          if (element?.type === 'Identifier' && signalVariables.has(element.name)) {
            context.report({
              node: element,
              messageId: 'signalInArray',
              data: { name: element.name },
              fix(fixer) {
                return fixer.replaceText(element, `${element.name}()`);
              },
            });
          }
        });
      },

      // Check object properties
      ObjectExpression(node: any) {
        node.properties.forEach((property: any) => {
          if (
            property.type === 'Property' &&
            property.value?.type === 'Identifier' &&
            signalVariables.has(property.value.name)
          ) {
            context.report({
              node: property.value,
              messageId: 'signalInArray',
              data: { name: property.value.name },
              fix(fixer) {
                return fixer.replaceText(property.value, `${property.value.name}()`);
              },
            });
          }
        });
      },
    };
  },
};
