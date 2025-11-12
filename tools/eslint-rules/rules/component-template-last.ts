/**
 * Enforces that `template` or `templateUrl` appear as the last property
 * in Angular @Component() decorator metadata.
 *
 * Works seamlessly with Nx + @typescript-eslint parser.
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { ESLintUtils } from '@typescript-eslint/utils';

export const RULE_NAME = 'component-template-last';

export const rule = ESLintUtils.RuleCreator(() => __filename)({
	name: RULE_NAME,
	meta: {
		type: 'layout',
		docs: {
			description: 'Ensure `template` or `templateUrl` is the last property in @Component.',
		},
		fixable: 'code',
		schema: [],
		messages: {
			templateLast: '`template` or `templateUrl` should be the last property in @Component metadata.',
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			// Match calls to @Component({...})
			'CallExpression[callee.name="Component"] > ObjectExpression'(node: TSESTree.ObjectExpression) {
				const properties = node.properties.filter(
					(p): p is TSESTree.Property => p.type === 'Property' && p.key.type === 'Identifier',
				);

				const last = properties[properties.length - 1];
				const templateProp = properties.find((p) => p.key['name'] === 'template' || p.key['name'] === 'templateUrl');

				if (!templateProp) return;
				if (last === templateProp) return; // already last ✅

				context.report({
					node: templateProp.key,
					messageId: 'templateLast',
					fix(fixer) {
						const sourceCode = context.getSourceCode();

						// Convert node to text
						const templateText = sourceCode.getText(templateProp);
						const otherProps = properties.filter((p) => p !== templateProp);
						const otherText = otherProps.map((p) => sourceCode.getText(p)).join(',\n');

						const newText = `{${otherText},\n${templateText}}`;
						return fixer.replaceText(node, newText);
					},
				});
			},
		};
	},
});
