/**
 * ESLint Rule: no-signal-in-callback
 *
 * Warns when signal functions are passed to callbacks or event handlers without being called.
 * This prevents accidentally passing the signal function instead of its value to callbacks.
 *
 * ❌ WRONG: <button onClick={() => setUser(userName)} />  // passes signal function
 * ✅ RIGHT: <button onClick={() => setUser(userName())} />  // passes the value
 */

import { Rule } from 'eslint';

export const noSignalInCallback: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Warn when signal functions are passed to callbacks without calling them',
      category: 'Signal Safety',
      recommended: true,
    },
    messages: {
      signalInCallback:
        'Signal "{{name}}" passed to callback without calling. Use {{name}}() to get the value.',
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

      // Check function call arguments
      CallExpression(node: any) {
        if (node.callee?.type === 'MemberExpression') {
          // Check if this looks like a callback setter (set*, update*, etc.)
          const calleeName = node.callee.property?.name || '';
          const isCallbackLike =
            calleeName.startsWith('set') ||
            calleeName.startsWith('update') ||
            calleeName.endsWith('Handler') ||
            calleeName === 'call' ||
            calleeName === 'apply';

          if (isCallbackLike) {
            node.arguments.forEach((arg: any) => {
              if (arg.type === 'Identifier' && signalVariables.has(arg.name)) {
                context.report({
                  node: arg,
                  messageId: 'signalInCallback',
                  data: { name: arg.name },
                  fix(fixer) {
                    return fixer.replaceText(arg, `${arg.name}()`);
                  },
                });
              }
            });
          }
        }

        // Check event handler callbacks in JSX
        if (
          node.callee?.name === 'fetch' ||
          node.callee?.property?.name === 'then' ||
          node.callee?.property?.name === 'catch'
        ) {
          node.arguments.forEach((arg: any) => {
            if (arg.type === 'Identifier' && signalVariables.has(arg.name)) {
              context.report({
                node: arg,
                messageId: 'signalInCallback',
                data: { name: arg.name },
              });
            }
          });
        }
      },
    };
  },
};
