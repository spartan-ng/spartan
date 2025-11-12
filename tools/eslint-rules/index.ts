import { rule as avoidComponentStyles, RULE_NAME as avoidComponentStylesName } from './rules/avoid-component-styles';
import {
	rule as preferRxjsOperatorCompat,
	RULE_NAME as preferRxjsOperatorCompatName,
} from './rules/prefer-rxjs-operator-compat';

import {
	rule as componentTemplateLast,
	RULE_NAME as componentTemplateLastName,
} from './rules/component-directive-key-order';

/**
 * Import your custom workspace rules at the top of this file.
 *
 * For example:
 *
 * import { RULE_NAME as myCustomRuleName, rule as myCustomRule } from './rules/my-custom-rule';
 *
 * In order to quickly get started with writing rules you can use the
 * following generator command and provide your desired rule name:
 *
 * ```sh
 * npx nx g @nx/eslint:workspace-rule {{ NEW_RULE_NAME }}
 * ```
 */

module.exports = {
	/**
	 * Apply the imported custom rules here.
	 *
	 * For example (using the example import above):
	 *
	 * rules: {
	 *  [myCustomRuleName]: myCustomRule
	 * }
	 */
	rules: {
		[preferRxjsOperatorCompatName]: preferRxjsOperatorCompat,
		[componentTemplateLastName]: componentTemplateLast,
		[avoidComponentStylesName]: avoidComponentStyles,
	},
};
