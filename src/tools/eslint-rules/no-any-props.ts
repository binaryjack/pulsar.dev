/**
 * ESLint Rule: no-any-props
 *
 * Disallows the use of "any" type in component prop interfaces.
 * Props should have explicit types for type safety and better DX.
 *
 * @example ❌ Invalid:
 * ```tsx
 * interface ComponentProps {
 *   data: any              // ❌ Use specific type
 *   children: any          // ❌ Use Accessor<JSX.Element>
 *   items: any[]           // ❌ Use Item[]
 * }
 * ```
 *
 * @example ✓ Valid:
 * ```tsx
 * interface ComponentProps {
 *   data: UserData
 *   children: Accessor<JSX.Element>
 *   items: Item[]
 * }
 * ```
 */

export const noAnyProps = {
  meta: {
    type: 'error',
    docs: {
      description: 'Disallow "any" type in component prop interfaces',
      category: 'TypeScript',
      recommended: true,
    },
    messages: {
      noAnyInProps: 'Prop "{{propName}}" should not use "any" type. Use explicit types instead.',
      useAccessorForChildren: 'Use "Accessor<JSX.Element>" for children prop, not "any".',
      useSpecificType: 'Use a specific type instead of "any" for better type safety.',
    },
    fixable: null,
    schema: [],
  },

  create(context: any) {
    return {
      // Match interface declarations
      TSInterfaceDeclaration(node: any) {
        // Check if it's a Props interface (ends with Props or has "Props" in name)
        const interfaceName = node.id.name;
        if (!interfaceName.includes('Props')) {
          return; // Not a props interface
        }

        // Check each property
        for (const member of node.body.body) {
          if (member.type !== 'TSPropertySignature') {
            continue;
          }

          const propName = member.key.name;
          const typeAnnotation = member.typeAnnotation?.typeAnnotation;

          if (!typeAnnotation) {
            continue;
          }

          // Check for direct "any" keyword
          if (typeAnnotation.type === 'TSAnyKeyword') {
            // Special message for "children" prop
            if (propName === 'children') {
              context.report({
                node: typeAnnotation,
                messageId: 'useAccessorForChildren',
              });
            } else {
              context.report({
                node: typeAnnotation,
                messageId: 'noAnyInProps',
                data: { propName },
              });
            }
          }

          // Check for any[] arrays
          if (typeAnnotation.type === 'TSArrayType') {
            const elementType = typeAnnotation.elementType;
            if (elementType.type === 'TSAnyKeyword') {
              context.report({
                node: elementType,
                messageId: 'noAnyInProps',
                data: { propName },
              });
            }
          }

          // Check for Promise<any>, Record<string, any>, etc.
          if (typeAnnotation.type === 'TSTypeReference') {
            checkTypeReferenceForAny(context, typeAnnotation, propName);
          }

          // Check for union types: string | any
          if (typeAnnotation.type === 'TSUnionType') {
            for (const type of typeAnnotation.types) {
              if (type.type === 'TSAnyKeyword') {
                context.report({
                  node: type,
                  messageId: 'noAnyInProps',
                  data: { propName },
                });
              }
            }
          }
        }
      },

      // Also check type aliases for props
      TSTypeAliasDeclaration(node: any) {
        const typeName = node.id.name;
        if (!typeName.includes('Props')) {
          return;
        }

        // Check if type is an object type
        if (node.typeAnnotation.type === 'TSTypeLiteral') {
          for (const member of node.typeAnnotation.members) {
            if (member.type !== 'TSPropertySignature') {
              continue;
            }

            const propName = member.key.name;
            const typeAnnotation = member.typeAnnotation?.typeAnnotation;

            if (typeAnnotation?.type === 'TSAnyKeyword') {
              if (propName === 'children') {
                context.report({
                  node: typeAnnotation,
                  messageId: 'useAccessorForChildren',
                });
              } else {
                context.report({
                  node: typeAnnotation,
                  messageId: 'noAnyInProps',
                  data: { propName },
                });
              }
            }
          }
        }
      },
    };
  },
};

/**
 * Helper: Recursively check type references for "any"
 */
function checkTypeReferenceForAny(context: any, node: any, propName: string) {
  if (!node.typeParameters) {
    return;
  }

  for (const param of node.typeParameters.params) {
    if (param.type === 'TSAnyKeyword') {
      context.report({
        node: param,
        messageId: 'useSpecificType',
      });
    }

    // Recursively check nested type references
    if (param.type === 'TSTypeReference') {
      checkTypeReferenceForAny(context, param, propName);
    }
  }
}
