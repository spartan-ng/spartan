/**
 * Enforces a specific property order inside Angular @Component() and @Directive() decorator metadata.
 *
 * Ensures that:
 *  - `template` or `templateUrl` always appear last
 *  - All other properties follow a custom defined order
 *
 * Works seamlessly with Nx + @typescript-eslint parser.
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { ESLintUtils } from '@typescript-eslint/utils';

export const RULE_NAME = 'component-directive-key-order';

// Custom enforced order (applies to both @Component and @Directive)
const ORDER = [
	'selector',
	'exportAs',
	'imports',
	'providers',
	'viewProviders',
	'encapsulation',
	'changeDetection',
	'hostDirectives',
	'host',
	'styles',
	'styleUrl',
	'template',
	'templateUrl',
];

export const rule = ESLintUtils.RuleCreator(() => __filename)({
	name: RULE_NAME,
	meta: {
		type: 'layout',
		docs: {
			description:
				'Ensure @Component() and @Directive() metadata properties follow a consistent custom order, with template/templateUrl last.',
		},
		fixable: 'code',
		schema: [],
		messages: {
			templateLast: '`template` or `templateUrl` should be the last property in @Component/@Directive metadata.',
			incorrectOrder:
				'Property "{{name}}" is not in the correct order. Expected order: selector, exportAs, imports, providers, viewProviders, changeDetection, hostDirectives, host, styleUrl|styles, template|templateUrl.',
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			// Match calls to @Component({...}) or @Directive({...})
			'CallExpression[callee.name=/^(Component|Directive)$/] > ObjectExpression'(node: TSESTree.ObjectExpression) {
				const properties = node.properties.filter(
					(p): p is TSESTree.Property => p.type === 'Property' && p.key.type === 'Identifier',
				);

				if (properties.length <= 1) return;

				const sourceCode = context.getSourceCode();
				const propNames = properties.map((p) => p.key['name']);

				// === 1️⃣ Enforce template/templateUrl last ===
				const last = properties[properties.length - 1];
				const templateProp = properties.find((p) => p.key['name'] === 'template' || p.key['name'] === 'templateUrl');

				if (templateProp && last !== templateProp) {
					context.report({
						node: templateProp.key,
						messageId: 'templateLast',
						fix(fixer) {
							const templateText = sourceCode.getText(templateProp);
							const otherProps = properties.filter((p) => p !== templateProp);
							const otherText = otherProps.map((p) => sourceCode.getText(p)).join(',\n');
							const newText = `{${otherText},\n${templateText}}`;
							return fixer.replaceText(node, newText);
						},
					});
					return; // don’t double-report
				}

				// === 2️⃣ Enforce full custom order ===
				const expected = ORDER.filter((name) => propNames.includes(name));
				const isInCorrectOrder = propNames.every((name, idx) => name === expected[idx]);

				if (!isInCorrectOrder) {
					const incorrect = propNames.find((name, i) => name !== expected[i]);
					context.report({
						node,
						messageId: 'incorrectOrder',
						data: { name: incorrect ?? 'Unknown' },
						fix(fixer) {
							const sortedProps = [...properties].sort((a, b) => {
								const aIndex = ORDER.indexOf(a.key['name']);
								const bIndex = ORDER.indexOf(b.key['name']);
								// Unlisted props stay after known ones
								if (aIndex === -1 && bIndex === -1) return 0;
								if (aIndex === -1) return 1;
								if (bIndex === -1) return -1;
								return aIndex - bIndex;
							});

							const newText = `{${sortedProps.map((p) => sourceCode.getText(p)).join(',\n')}}`;
							return fixer.replaceText(node, newText);
						},
					});
				}
			},
		};
	},
});
