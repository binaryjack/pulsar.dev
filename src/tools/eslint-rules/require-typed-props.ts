/**
 * ESLint Rule: require-typed-props
 *
 * Enforces that all component functions have properly typed props interfaces.
 * Components should not use inline object types or untyped parameters.
 *
 * @example ❌ Invalid:
 * ```tsx
 * const Component = ({ count, setCount }) => { ... }  // No types
 * const Component = (props: any) => { ... }           // any type
 * const Component = ({ count }: { count: number }) => { ... }  // Inline type
 * ```
 *
 * @example ✓ Valid:
 * ```tsx
 * interface ComponentProps {
 *   count: Accessor<number>
 *   setCount: Setter<number>
 * }
 * const Component = ({ count, setCount }: ComponentProps) => { ... }
 * ```
 */

export const requireTypedProps = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require properly typed props interface for all components',
      category: 'TypeScript',
      recommended: true,
    },
    messages: {
      missingTypeAnnotation: 'Component props must have a type annotation',
      useNamedInterface: 'Component props should use a named interface, not inline type',
      noAnyType: 'Component props must not use "any" type',
      preferInterface: 'Use "interface" instead of "type" for component props',
    },
    fixable: null,
    schema: [],
  },

  create(context: any) {
    return {
      // Match: const Component = (props) => { ... }
      // Match: export const Component = ({ foo, bar }) => { ... }
      VariableDeclarator(node: any) {
        const init = node.init;

        // Check if it's an arrow function or function expression
        if (
          !init ||
          (init.type !== 'ArrowFunctionExpression' && init.type !== 'FunctionExpression')
        ) {
          return;
        }

        // Check if function returns JSX (component pattern)
        const returnsJSX = hasJSXReturn(init);
        if (!returnsJSX) {
          return;
        }

        // Get the first parameter (props)
        const propsParam = init.params[0];
        if (!propsParam) {
          return; // No props needed
        }

        // Check if props have type annotation
        if (!propsParam.typeAnnotation) {
          context.report({
            node: propsParam,
            messageId: 'missingTypeAnnotation',
          });
          return;
        }

        const typeAnnotation = propsParam.typeAnnotation.typeAnnotation;

        // Reject "any" type
        if (typeAnnotation.type === 'TSAnyKeyword') {
          context.report({
            node: typeAnnotation,
            messageId: 'noAnyType',
          });
          return;
        }

        // Reject inline object types: { foo: number, bar: string }
        if (typeAnnotation.type === 'TSTypeLiteral') {
          context.report({
            node: typeAnnotation,
            messageId: 'useNamedInterface',
          });
          return;
        }

        // Accept: TypeReference (e.g., ComponentProps, Pulsar.Component<Props>)
        if (typeAnnotation.type === 'TSTypeReference') {
          return; // ✓ Valid
        }
      },

      // Match: function Component(props) { ... }
      FunctionDeclaration(node: any) {
        const returnsJSX = hasJSXReturn(node);
        if (!returnsJSX) {
          return;
        }

        const propsParam = node.params[0];
        if (!propsParam) {
          return;
        }

        if (!propsParam.typeAnnotation) {
          context.report({
            node: propsParam,
            messageId: 'missingTypeAnnotation',
          });
          return;
        }

        const typeAnnotation = propsParam.typeAnnotation.typeAnnotation;

        if (typeAnnotation.type === 'TSAnyKeyword') {
          context.report({
            node: typeAnnotation,
            messageId: 'noAnyType',
          });
          return;
        }

        if (typeAnnotation.type === 'TSTypeLiteral') {
          context.report({
            node: typeAnnotation,
            messageId: 'useNamedInterface',
          });
        }
      },
    };
  },
};

/**
 * Helper: Check if function body contains JSX return
 */
function hasJSXReturn(node: any): boolean {
  if (!node.body) return false;

  // Arrow function with JSX expression: () => <div>...</div>
  if (node.body.type === 'JSXElement' || node.body.type === 'JSXFragment') {
    return true;
  }

  // Function with block body
  if (node.body.type === 'BlockStatement') {
    return hasJSXInBlock(node.body);
  }

  return false;
}

/**
 * Helper: Recursively check block for JSX returns
 */
function hasJSXInBlock(block: any): boolean {
  for (const statement of block.body) {
    if (statement.type === 'ReturnStatement') {
      const arg = statement.argument;
      if (arg && (arg.type === 'JSXElement' || arg.type === 'JSXFragment')) {
        return true;
      }
    }
  }
  return false;
}
