const nx = require('@nx/eslint-plugin');
const baseConfig = require('../../eslint.config.cjs');

module.exports = [
	...baseConfig,
	...nx.configs['flat/angular'],
	...nx.configs['flat/angular-template'],
	{
		files: ['**/*.ts'],
		rules: {
			'@angular-eslint/directive-selector': [
				'error',
				{
					type: 'attribute',
					prefix: 'spartan',
					style: 'camelCase',
				},
			],
			'@angular-eslint/component-selector': [
				'error',
				{
					type: 'element',
					prefix: 'spartan',
					style: 'kebab-case',
				},
			],
			'@nx/enforce-module-boundaries': 'off',
			'@angular-eslint/prefer-on-push-component-change-detection': 'off',
			'@angular-eslint/directive-class-suffix': 'off',
			'@angular-eslint/component-class-suffix': 'off',
		},
	},
	{
		files: ['**/*.html'],
		// Override or add rules here
		rules: {
			// We should probably turn this on, but for now it's off
			'@angular-eslint/template/elements-content': 'off',
			'@angular-eslint/template/label-has-associated-control': 'off',
			'@angular-eslint/template/interactive-supports-focus': 'off',
			'@angular-eslint/template/click-events-have-key-events': 'off',
		},
	},
	{
		files: ['**/*.json'],
		// Override or add rules here
		rules: {
			'@nx/dependency-checks': 'off',
		},
	},
];
