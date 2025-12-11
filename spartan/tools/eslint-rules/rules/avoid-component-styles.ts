/**
 * This file sets you up with structure needed for an ESLint rule.
 *
 * It leverages utilities from @typescript-eslint to allow TypeScript to
 * provide autocompletions etc for the configuration.
 *
 * Your rule's custom logic will live within the create() method below
 * and you can learn more about writing ESLint rules on the official guide:
 *
 * https://eslint.org/docs/developer-guide/working-with-rules
 *
 * You can also view many examples of existing rules here:
 *
 * https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin/src/rules
 */

import { ESLintUtils, type TSESTree } from '@typescript-eslint/utils';

// NOTE: The rule will be available in ESLint configs as "@nx/workspace-avoid-component-styles"
export const RULE_NAME = 'avoid-component-styles';

const FORBIDDEN_PROPERTIES = ['encapsulation', 'styles', 'styleUrls'];

export const rule = ESLintUtils.RuleCreator(() => __filename)({
	name: RULE_NAME,
	meta: {
		type: 'problem',
		docs: {
			description: 'Disallow encapsulation, styles, and styleUrls properties in Angular @Component decorators',
		},
		fixable: 'code',
		schema: [],
		messages: {
			avoidComponentStyles:
				'The "{{property}}" property should not be used in @Component decorators. Component styles should be avoided.',
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			Decorator(node: TSESTree.Decorator) {
				// Check if this is a @Component decorator
				if (
					node.expression.type !== 'CallExpression' ||
					node.expression.callee.type !== 'Identifier' ||
					node.expression.callee.name !== 'Component'
				) {
					return;
				}

				// Get the first argument (the configuration object)
				const configArg = node.expression.arguments[0];
				if (!configArg || configArg.type !== 'ObjectExpression') {
					return;
				}

				// Find forbidden properties
				const forbiddenProps = configArg.properties.filter(
					(prop): prop is TSESTree.Property =>
						prop.type === 'Property' && prop.key.type === 'Identifier' && FORBIDDEN_PROPERTIES.includes(prop.key.name),
				);

				// Report each forbidden property
				forbiddenProps.forEach((prop) => {
					const propertyName = (prop.key as TSESTree.Identifier).name;

					context.report({
						node: prop,
						messageId: 'avoidComponentStyles',
						data: {
							property: propertyName,
						},
						fix(fixer) {
							const sourceCode = context.sourceCode;
							const properties = configArg.properties;

							// If it's the only property, remove just the property
							if (properties.length === 1) {
								return fixer.remove(prop);
							}

							// Get the start and end positions
							let rangeStart = prop.range[0];
							let rangeEnd = prop.range[1];

							// Get the token after (likely a comma)
							const tokenAfter = sourceCode.getTokenAfter(prop);
							const tokenBefore = sourceCode.getTokenBefore(prop);

							if (tokenAfter && tokenAfter.value === ',') {
								// This property has a trailing comma - it's not the last property
								// Include the comma
								rangeEnd = tokenAfter.range[1];

								// Remove the newline and leading whitespace of the next line
								const textAfterComma = sourceCode.text.substring(rangeEnd);
								const newlineMatch = textAfterComma.match(/^(\r?\n[ \t]*)/);
								if (newlineMatch) {
									rangeEnd += newlineMatch[0].length;
								}
							} else {
								// This property is last (no trailing comma)
								// We need to remove the preceding comma and the entire line
								if (tokenBefore && tokenBefore.value === ',') {
									// Remove from after the comma (which includes newline + indentation + property)
									rangeStart = tokenBefore.range[1];
								}
							}

							return fixer.removeRange([rangeStart, rangeEnd]);
						},
					});
				});
			},
		};
	},
});
