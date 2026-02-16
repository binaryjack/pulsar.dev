/**
 * ESLint Rule: accessor-must-be-called
 *
 * Enforces that Accessor<T> typed props must be called with () when used in JSX.
 * This prevents rendering "[object Function]" instead of the actual value.
 *
 * @example ❌ Invalid:
 * ```tsx
 * interface Props {
 *   count: Accessor<number>
 *   user: Accessor<User>
 * }
 *
 * const Component = ({ count, user }: Props) => {
 *   return (
 *     <div>
 *       {count}           // ❌ Should be count()
 *       {user.name}       // ❌ Should be user().name
 *     </div>
 *   );
 * };
 * ```
 *
 * @example ✓ Valid:
 * ```tsx
 * const Component = ({ count, user }: Props) => {
 *   return (
 *     <div>
 *       {count()}         // ✓ Correct
 *       {user().name}     // ✓ Correct
 *     </div>
 *   );
 * };
 * ```
 */

export const accessorMustBeCalled = {
  meta: {
    type: 'error',
    docs: {
      description: 'Require calling Accessor<T> props with () in JSX',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      accessorNotCalled: 'Accessor "{{name}}" must be called with () to get its value.',
      useCallExpression: 'Call accessor with {{name}}() instead of {{name}}.',
      childrenMustBeCalled: 'Children prop (Accessor<JSX.Element>) must be called with ().',
    },
    fixable: 'code',
    schema: [],
  },

  create(context: any) {
    // Track which props are Accessor<T> types
    const accessorProps = new Map<string, Set<string>>(); // scope -> Set of accessor prop names

    return {
      // Find props typed as Accessor<T>
      TSInterfaceDeclaration(node: any) {
        const interfaceName = node.id.name;
        if (!interfaceName.includes('Props')) {
          return;
        }

        const accessors = new Set<string>();

        for (const member of node.body.body) {
          if (member.type !== 'TSPropertySignature') {
            continue;
          }

          const propName = member.key.name;
          const typeAnnotation = member.typeAnnotation?.typeAnnotation;

          if (isAccessorType(typeAnnotation)) {
            accessors.add(propName);
          }
        }

        if (accessors.size > 0) {
          accessorProps.set(interfaceName, accessors);
        }
      },

      // Check component function parameters
      'VariableDeclarator, FunctionDeclaration'(node: any) {
        const func = node.type === 'VariableDeclarator' ? node.init : node;
        if (
          !func ||
          (func.type !== 'ArrowFunctionExpression' &&
            func.type !== 'FunctionExpression' &&
            func.type !== 'FunctionDeclaration')
        ) {
          return;
        }

        const propsParam = func.params[0];
        if (!propsParam) {
          return;
        }

        // Get the props type name
        const typeAnnotation = propsParam.typeAnnotation?.typeAnnotation;
        if (!typeAnnotation || typeAnnotation?.type !== 'TSTypeReference') {
          return;
        }

        const propsTypeName = typeAnnotation.typeName.name;
        const accessors = accessorProps.get(propsTypeName);
        if (!accessors || accessors.size === 0) {
          return;
        }

        // Now check JSX in this component for accessor usage
        checkJSXForAccessors(context, func.body, accessors);
      },
    };
  },
};

/**
 * Helper: Check if type annotation is Accessor<T> or similar
 */
function isAccessorType(typeAnnotation: any): boolean {
  if (!typeAnnotation) {
    return false;
  }

  // Direct function type: () => T
  if (typeAnnotation.type === 'TSFunctionType' && typeAnnotation.params.length === 0) {
    return true;
  }

  // Type reference: Accessor<T>, Pulsar.Accessor<T>
  if (typeAnnotation.type === 'TSTypeReference') {
    const typeName = typeAnnotation.typeName;

    // Simple: Accessor
    if (typeName.name === 'Accessor') {
      return true;
    }

    // Qualified: Pulsar.Accessor
    if (typeName.type === 'TSQualifiedName' && typeName.right.name === 'Accessor') {
      return true;
    }
  }

  return false;
}

/**
 * Helper: Recursively check JSX expressions for uncalled accessors
 */
function checkJSXForAccessors(context: any, node: any, accessors: Set<string>) {
  if (!node) {
    return;
  }

  // JSX Expression: {count}
  if (node.type === 'JSXExpressionContainer') {
    const expr = node.expression;

    // Check if it's an identifier that's an accessor
    if (expr.type === 'Identifier' && accessors.has(expr.name)) {
      context.report({
        node: expr,
        messageId: 'accessorNotCalled',
        data: { name: expr.name },
        fix(fixer: any) {
          return fixer.replaceText(expr, `${expr.name}()`);
        },
      });
    }

    // Check for member expressions like user.name (should be user().name)
    if (
      expr.type === 'MemberExpression' &&
      expr.object.type === 'Identifier' &&
      accessors.has(expr.object.name)
    ) {
      context.report({
        node: expr.object,
        messageId: 'accessorNotCalled',
        data: { name: expr.object.name },
        fix(fixer: any) {
          return fixer.replaceText(expr.object, `${expr.object.name}()`);
        },
      });
    }

    // Recursively check nested expressions
    checkJSXForAccessors(context, expr, accessors);
  }

  // Recursively traverse children
  if (Array.isArray(node)) {
    for (const child of node) {
      checkJSXForAccessors(context, child, accessors);
    }
  } else if (node.children) {
    checkJSXForAccessors(context, node.children, accessors);
  } else if (node.body) {
    if (Array.isArray(node.body)) {
      for (const statement of node.body) {
        checkJSXForAccessors(context, statement, accessors);
      }
    } else {
      checkJSXForAccessors(context, node.body, accessors);
    }
  } else if (node.type === 'BlockStatement') {
    for (const statement of node.body) {
      checkJSXForAccessors(context, statement, accessors);
    }
  } else if (node.type === 'ReturnStatement') {
    checkJSXForAccessors(context, node.argument, accessors);
  } else if (node.type === 'JSXElement' || node.type === 'JSXFragment') {
    checkJSXForAccessors(context, node.children, accessors);
  }
}
