const baseConfig = require('../../eslint.config.cjs');

module.exports = [
	...baseConfig,
	{
		files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
		rules: {},
	},
	{
		files: ['**/*.ts', '**/*.tsx'],
		rules: {
			'@angular-eslint/prefer-output-readonly': 'off',
			'@angular-eslint/prefer-on-push-component-change-detection': 'off',
		},
	},
	{
		files: ['**/*.js', '**/*.jsx'],
		rules: {},
	},
	{
		files: ['**/*.json'],
		rules: {
			'@nx/nx-plugin-checks': 'error',
			'@nx/dependency-checks': 'off',
		},
		languageOptions: {
			parser: require('jsonc-eslint-parser'),
		},
	},
];
