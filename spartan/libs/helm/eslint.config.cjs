const nx = require('@nx/eslint-plugin');
const baseConfig = require('../../eslint.config.cjs');

module.exports = [
	...baseConfig,
	{
		files: ['**/*.json'],
		rules: {
			'@nx/dependency-checks': [
				'error',
				{
					ignoredDependencies: ['jest-preset-angular'],
					ignoredFiles: ['{projectRoot}/eslint.config.{js,cjs,mjs}'],
				},
			],
		},
		languageOptions: {
			parser: require('jsonc-eslint-parser'),
		},
	},
	...nx.configs['flat/angular'],
	...nx.configs['flat/angular-template'],
	{
		files: ['**/*.ts'],
		rules: {
			'@angular-eslint/directive-selector': [
				'error',
				{
					type: 'attribute',
					prefix: 'hlm',
					style: 'camelCase',
				},
			],
			'@angular-eslint/component-selector': [
				'error',
				{
					type: ['element', 'attribute'],
					prefix: 'hlm',
					style: 'kebab-case',
				},
			],
			'@angular-eslint/no-input-rename': 'off',
			'@angular-eslint/directive-class-suffix': 'off',
			'@angular-eslint/component-class-suffix': 'off',
			'@angular-eslint/prefer-output-readonly': 'error',
			'@angular-eslint/prefer-on-push-component-change-detection': ['error'],
			'@angular-eslint/prefer-signals': ['error'],
			'@nx/workspace-avoid-component-styles': 'error',
		},
	},
	{
		files: ['**/*.html'],
		// Override or add rules here
		rules: {
			'@angular-eslint/template/interactive-supports-focus': 'off',
			'@angular-eslint/template/click-events-have-key-events': 'off',
		},
	},
];
