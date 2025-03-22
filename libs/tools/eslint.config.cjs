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
			'@nx/dependency-checks': [
				'error',
				{
					ignoredDependencies: ['process', 'enquirer', '@phenomnomnominal/tsquery'],
				},
			],
		},
		languageOptions: {
			parser: require('jsonc-eslint-parser'),
		},
	},
];
