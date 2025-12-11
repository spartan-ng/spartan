const cypress = require('eslint-plugin-cypress/flat');
const baseConfig = require('../../eslint.config.cjs');

module.exports = [
	cypress.configs['recommended'],

	...baseConfig,
	{
		// Override or add rules here
		files: ['**/*.ts'],
		rules: {
			'@angular-eslint/prefer-output-readonly': 'off',
			'@angular-eslint/prefer-on-push-component-change-detection': 'off',
		},
	},
];
